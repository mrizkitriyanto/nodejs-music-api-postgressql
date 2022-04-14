
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  // GET ALL SONG- Mendapatkan Semua LAgu
  // Endpoint: GET /songs/

  // Status code 200 (ok)
  // body:
  //    - status: "success"
  //    - data:
  //        - songs: songs
  async getSongsHandler(request, h) {
    const {title, performer} = request.query;

    let songs = await this._service.getSongs(title, performer);
    songs = songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
    const response = h.response({
      status: 'success',
      message: 'Berhasil mengambil daftar lagu',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  // GET SONG BY ID- Mendapatkan Lagu berdaar ID
  // Endpoint: GET /songs/{id}

  // Status code 200 (ok)
  // body:
  //    - status: "success"
  //    - data:
  //        - song: song
  async getSongByIdHandler(request, h) {
    const {id} = request.params;
    const song = await this._service.getSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Berhasil mengambil lagu',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  // INSERT SONG BY - Menambahkan Lagu
  // Endpoint: POST /songs
  // Body Request
  //     - title : string, required
  //     - year : number, required
  //     - genre : string, required
  //     - performer : string, required
  //     - duration : number?
  //     - albumid : string?

  // Status code 201 (created)
  // body:
  //    - status: "success"
  //    - data:
  //        - songid: "song_id"
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {title, year, genre, performer, duration, albumId} =
        request.payload;

    // penyesuaian variable
    const albumid = albumId;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumid,
    });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  // EDIT SONG BY ID- Mengubah Lagu berdasar ID
  // Endpoint: PUT /songs/{id}
  // Body Request
  //     - title : string, required
  //     - year : number, required
  //     - genre : string, required
  //     - performer : string, required
  //     - duration : number?
  //     - albumid : string?

  // Status code 201 (created)
  // body:
  //    - status: "success"
  //    - data:
  //        - message: *any
  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {id} = request.params;
    const {title, year, genre, performer, duration, albumId} =
        request.payload;
    await this._service.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'Berhasil mengubah lagu',
    });
    response.code(200);
    return response;
  }

  // DELETE SONG BY ID- Menghapus Lagu berdaar ID
  // Endpoint: DELETE /songs/{id}

  // Status code 200 (ok)
  // body:
  //    - status: "success"
  //    - data:
  //        - message: *any
  async deleteSongByIdHandler(request, h) {
    const {id} = request.params;
    await this._service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus lagu',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;
