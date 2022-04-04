const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }


  // GET ALL ALBUM -  Mendapatkan semua album
  // Endpoint: GET /albums
  // Status code 200
  // body:
  //    - status: "success"
  //    - data:
  //        - album: album
  async getAlbumsHandler(request, h) {
    try {
      const albums = await this._service.getAlbums();
      const response = h.response({
        status: 'success',
        message: 'Berhasil mengambil daftar album',
        data: {
          albums,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Internal Server Error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // GET ALBUM BY ID - Mendapatkan album berdasar ID
  // Endpoint: GET /albums/{id}
  // Status code 200
  // body:
  //    - status: "success"
  //    - data:
  //        - album: album
  async getAlbumByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const album = await this._service.getAlbumById(id);
      const response = h.response({
        status: 'success',
        message: 'Berhasil mengambil album',
        data: {
          album,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Internal Server Error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // POST ALBUM - Menambahkan album
  // Endpoint: POST /albums

  // Body Request
  //    - name : string, required
  //    - year : number, required

  // Status code 201 (created)
  // body:
  //    - status: "success"
  //    - data:
  //        - albumID: "album_id"
  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const {name, year} = request.payload;
      const albumId = await this._service.addAlbum({name, year});
      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Internal Server Error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // EDIT ALBUM BY ID - Mengubah album berdasar Id album
  // PUT /albums/{id}
  // Body Request
  //     - name : string, requireed
  //     - year : number, required

  // Status code 200 (ok)
  // body:
  //    - status: "success"
  //    - data:
  //        - album: *any
  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const {id} = request.params;
      const {name, year} = request.payload;
      await this._service.editAlbumById(id, {name, year});
      const response = h.response({
        status: 'success',
        message: 'Berhasil mengubah data album',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Internal Server Error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // DELETE ALBUM BY ID - Menghapus album berdasarkan ID
  // Endpoint: DELETE /albums/{id}

  // Status code 200 (ok)
  // body:
  //    - status: "success"
  //    - data:
  //        - albumID: *any
  async deleteAlbumByIdHandler(request, h) {
    try {
      const {id} = request.params;
      await this._service.deleteAlbumById(id);
      const response = h.response({
        status: 'success',
        message: 'Berhasil menghapus data album',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Internal Server Error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AlbumsHandler;
