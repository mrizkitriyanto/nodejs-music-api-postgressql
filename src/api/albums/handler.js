
class AlbumsHandler {
  constructor(service, validator, storageService, uploadValidator) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this._uploadValidator = uploadValidator;

    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
  }


  // GET ALL ALBUM -  Mendapatkan semua album
  // Endpoint: GET /albums
  // Status code 200
  // body:
  //    - status: "success"
  //    - data:
  //        - album: album
  async getAlbumsHandler(request, h) {
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
  }

  // GET ALBUM BY ID - Mendapatkan album berdasar ID
  // Endpoint: GET /albums/{id}
  // Status code 200
  // body:
  //    - status: "success"
  //    - data:
  //        - album: album
  async getAlbumByIdHandler(request, h) {
    const {id} = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongsByAlbumId(id);
    album['songs'] = songs;
    const response = h.response({
      status: 'success',
      message: 'Berhasil mengambil album',
      data: {
        album,
      },
    });
    response.code(200);
    return response;
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
  }

  // DELETE ALBUM BY ID - Menghapus album berdasarkan ID
  // Endpoint: DELETE /albums/{id}

  // Status code 200 (ok)
  // body:
  //    - status: "success"
  //    - data:
  //        - albumID: *any
  async deleteAlbumByIdHandler(request, h) {
    const {id} = request.params;
    await this._service.deleteAlbumById(id);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus data album',
    });
    response.code(200);
    return response;
  }

  // / Album Cover Handler
  async postAlbumCoverHandler(request, h) {
    const {cover} = request.payload;
    this._uploadValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const {id} = request.params;
    const path = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;
    await this._service.insertAlbumCover(id, path);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);

    return response;
  }
}

module.exports = AlbumsHandler;
