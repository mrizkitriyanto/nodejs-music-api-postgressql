
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
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumLikeHandler = this.getAlbumLikeHandler.bind(this);
  }


  // GET ALL ALBUM -  Mendapatkan semua album
  // Endpoint: GET /albums
  // Status code 200
  // body:
  //    - status: "success"
  //    - data:
  //        - album: album
  async getAlbumsHandler(request, h) {
    const {albums, isCache} = await this._service.getAlbums();
    const response = h.response({
      status: 'success',
      message: 'Berhasil mengambil daftar album',
      data: {
        albums,
      },
    });
    if (isCache) response.header('X-Data-Source', 'cache');
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
    const {album, isCache: isCacheAlbum} = await this._service.getAlbumById(
        id,
    );
    const {songs, isCache: isCacheSong} =
        await this._service.getSongsByAlbumId(id);

    // change key
    album['coverUrl'] = album['coverurl'];
    delete album['coverurl'];

    // get songs list
    album['songs'] = songs;

    const response = h.response({
      status: 'success',
      message: 'Berhasil mengambil album',
      data: {
        album,
      },
    });
    response.code(200);

    // Jika menerima dari cache maka header dicustom
    if (isCacheAlbum || isCacheSong) {
      response.header('X-Data-Source', 'cache');
    }

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

  // Album Like Handler
  async postAlbumLikeHandler(request, h) {
    const {id: albumid} = request.params;
    const {id: userid} = request.auth.credentials;
    // check album
    await this._service.getAlbumById(albumid);

    await this._service.setLikeAlbum(albumid, userid);
    const response = h.response({
      status: 'success',
      message: 'Berhasil melakukan aksi',
    });
    response.code(201);
    return response;
  }

  // Album Cover Handler
  async postAlbumCoverHandler(request, h) {
    const {cover} = request.payload;
    this._uploadValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const {id} = request.params;
    const fileLocation = `${request.headers['x-forwarded-proto'] || request.server.info.protocol}://${request.info.host}/albums/images/${filename}`;
    await this._service.insertAlbumCover(id, fileLocation);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);

    return response;
  }

  // [GET] Album Total Like Handler
  async getAlbumLikeHandler(request, h) {
    const {id} = request.params;
    const {likes, isCache} = await this._service.getLikeAlbum(id);
    const response = h.response({
      status: 'success',
      data: {
        likes: likes,
      },
    });
    response.code(200);

    // Jika menerima dari cache maka header dicustom
    if (isCache) response.header('X-Data-Source', 'cache');

    return response;
  }
}

module.exports = AlbumsHandler;
