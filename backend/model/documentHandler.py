from langchain_community.document_loaders.pdf import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from io import BytesIO
import os

class DocumentHandler:

    def load_documents(self, data_path: str) -> list[Document]:
        
        document_loader = PyPDFDirectoryLoader(data_path)
        
        return document_loader.load()

    def split_documents(self, documents : list[Document]) -> list[Document]:

        """ Split documents into small chunks """

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size = 800,
            chunk_overlap = 200,
            length_function = len,
            is_separator_regex = False,
        )    

        return text_splitter.split_documents(documents)

    def add_ids_to_chunks(self, chunks : list[Document]) -> list[Document]:

        """ Assign unique personalized ids for each chunk to avoid chunk duplication"""
        
        last_page_id = None
        current_chunk_index = 0

        for chunk in chunks:
            source = chunk.metadata.get("source")
            page = chunk.metadata.get("page")

            current_page_id = f"{source}:{page}"
            
            if current_page_id == last_page_id:
                current_chunk_index += 1
            else:
                current_chunk_index = 0

            chunk_id = f"{current_page_id}:{current_chunk_index}"
            last_page_id = current_page_id
            
            chunk.metadata["id"] = chunk_id

        return chunks