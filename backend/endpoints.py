from flask import *
from flask_cors import CORS
import os
from model.documentHandler import *
from model.chromaDBHandler import *
from model.ragHandler import *

app = Flask(__name__)
CORS(app)
app.secret_key = "123456"

def setup_fileSystem():
    if not os.path.exists("data"):
        os.mkdir("data")
        os.mkdir("data/raw_files")
        os.mkdir("data/vector_db")

    if not os.path.exists("data/raw_files"):
        os.mkdir("data/raw_files")
        os.mkdir(f"data/raw_files/{session.get('user_id')}")
    if not os.path.exists(f"data/raw_files/{session.get('user_id')}"):
        os.mkdir(f"data/raw_files/{session.get('user_id')}")

    if not os.path.exists("data/vector_db"):
        os.mkdir("data/vector_db")
        os.mkdir(f"data/vector_db/{session.get('user_id')}")
    if not os.path.exists(f"data/vector_db/{session.get('user_id')}"):
        os.mkdir(f"data/vector_db/{session.get('user_id')}")

# Endpoint for uploading files and saving them locally (on the server)
@app.route("/uploadFile", methods=["POST"])
def save_file_locally():

    if request.method == "POST":
        session["user_id"] = "aabbccdd11"
        # Initialize document handler, database handler, and RAG handler
        document_handler = DocumentHandler()
        db_handler = ChromaDBHandler(f"data/vector_db/{session.get('user_id')}")
        app.config["UPLOAD_FOLDER"] = f"data/raw_files/{session.get('user_id')}"
        setup_fileSystem()
        if 'pdfFile' not in request.files:
            print('No file part')
            return jsonify({'error': 'No file part'}), 400

        file = request.files['pdfFile']

        if file.filename == '':
            print('No selected file')
            return jsonify({'error': 'No selected file'}), 400
        
        # Save the file to disk
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        if not os.path.exists(file_path):
            file.save(file_path)
        else:
            print('file exists already')
            return jsonify({'error': 'file exists already'}), 200
        
        docs = document_handler.load_documents(app.config['UPLOAD_FOLDER'])
        chunks = document_handler.add_ids_to_chunks(document_handler.split_documents(docs))
        db_handler.add_to_chromadb(chunks)

        return jsonify({'success': 'file(s) uploaded successfully'}), 200

# Endpoint for sending prompts to the LLM and getting response
@app.route("/queryRag", methods=["POST"])
def PromptRag():

    if request.method == "POST":
        setup_fileSystem()
        session["user_id"] = "aabbccdd11"
        db_handler = ChromaDBHandler(f"data/vector_db/{session.get('user_id')}")
        rag_handler = RAGHandler()
        prompt = request.get_json().get("message")
        if prompt:
            llm_response = rag_handler.query_rag(prompt, db_handler.db)[0]
            print(llm_response)
            return jsonify({"response": llm_response}),200

if __name__ == "__main__":
    app.run(debug=True)
