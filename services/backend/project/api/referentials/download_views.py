from flask import current_app, send_from_directory
from flask_restplus import Resource, fields, Namespace
from project.api.utils.decorators import authorization_required
import os

download_namespace = Namespace('download')
availableFiles = {
    "genisses_moyennes": " calculs_genisses_moyennes.xlsx"
}


class FileDownload(Resource):

    @ download_namespace.response(200, "Success")
    @ download_namespace.response(404, "<filename>  file does not exist")
    def get(self, filename):
        folder = current_app.config.get("UPLOAD_FOLDER")
        UPLOAD_PATH = '../referential/'+folder
        try:
            return send_from_directory(
                directory=UPLOAD_PATH,
                filename=availableFiles["genisses_moyennes"],
                as_attachment=True,
                mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
        except Exception as e:
            return {"message": f"Erreur lors du téléchargement : {str(e)}"}, 500


download_namespace.add_resource(FileDownload, "/<string:filename>")
