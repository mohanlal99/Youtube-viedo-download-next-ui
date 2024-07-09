from asyncio import subprocess
from flask import Flask, after_this_request, request, jsonify, send_file
from pytube import YouTube
from pytube.exceptions import VideoUnavailable
import os
import logging
from tempfile import NamedTemporaryFile
from flask_cors import CORS
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/')
def home():
    return "Welcome to the YouTube Info and Download API!"

@app.route('/video_info', methods=['POST'])
def video_info():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        yt = YouTube(url)
        streams = yt.streams.filter(file_extension='mp4', type='video')
        stream_list = [
            {
                "itag": stream.itag,
                "resolution": stream.resolution,
                "mime_type": stream.mime_type,
                "type": stream.type,
                "video_codec": stream.video_codec,
                "audio_codec": stream.audio_codec,
                "size": stream.filesize
            }
            for stream in streams
        ]
        video_data = {
            "title": yt.title,
            "description": yt.description,
            "views": yt.views,
            "length": yt.length,
            "rating": yt.rating,
            "author": yt.author,
            "publish_date": yt.publish_date.strftime('%Y-%m-%d'),
            "thumbnail_url": yt.thumbnail_url,
            "streams": stream_list
        }
        return jsonify(video_data)
    except VideoUnavailable:
        return jsonify({"error": "Video unavailable"}), 404
    except Exception as e:
        logging.error(f"Error fetching video info: {e}")
        return jsonify({"error": str(e)}), 500
@app.route('/download', methods=['POST'])
def download_video():
    data = request.get_json()
    url = data.get('url')
    itag = data.get('itag')

    if not url or not itag:
        return jsonify({"error": "URL and itag must be provided"}), 400

    try:
        yt = YouTube(url)
        stream = yt.streams.get_by_itag(itag)

        if not stream:
            return jsonify({"error": "Stream with the specified itag not found"}), 404

        @after_this_request
        def remove_file(response):
            try:
                os.remove(stream.default_filename)
            except Exception as error:
                app.logger.error("Error removing or closing downloaded file", error)
            return response

        stream.download()
        return send_file(stream.default_filename, as_attachment=True)
    except VideoUnavailable:
        return jsonify({"error": "Video unavailable"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    app.run(debug=True)
