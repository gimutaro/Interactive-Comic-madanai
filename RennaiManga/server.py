#!/usr/bin/env python3
"""
シンプルなプロキシサーバー
Anthropic APIへのリクエストを中継してCORS問題を回避
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import requests
from urllib.parse import urlparse
import os

class ProxyHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """プリフライトリクエストの処理"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """POSTリクエストの処理"""
        if self.path == '/api/messages':
            # リクエストボディを読み取る
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            # APIキーとモデルを取得
            api_key = data.get('api_key')
            model = data.get('model', 'claude-3-opus-20240229')
            messages = data.get('messages')
            max_tokens = data.get('max_tokens', 1000)
            
            # Anthropic APIにリクエストを送信
            try:
                response = requests.post(
                    'https://api.anthropic.com/v1/messages',
                    headers={
                        'content-type': 'application/json',
                        'x-api-key': api_key,
                        'anthropic-version': '2023-06-01'
                    },
                    json={
                        'model': model,
                        'max_tokens': max_tokens,
                        'messages': messages
                    }
                )
                
                # レスポンスを返す
                self.send_response(response.status_code)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response.content)
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        """GETリクエストの処理（HTMLファイルを提供）"""
        if self.path == '/' or self.path == '/manga-spread-viewer.html':
            try:
                with open('manga-spread-viewer.html', 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(content)
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
        elif self.path.endswith('.png'):
            # 画像ファイルの提供
            file_path = self.path.lstrip('/')
            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'image/png')
                self.end_headers()
                self.wfile.write(content)
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    port = 8000
    server = HTTPServer(('localhost', port), ProxyHandler)
    print(f'サーバーを起動しました: http://localhost:{port}')
    print('Ctrl+C で終了')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nサーバーを停止しました')