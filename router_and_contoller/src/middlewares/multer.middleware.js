import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage,
})

// after all this, we have just configured a production grade set up for backend,
// we have not even written a single route or controller

/* Multer is a middleware that:

   1. Reads multipart/form-data requests
   2. Extracts the file from the request
   3. Saves it to your server (public/temp)
   4. Adds req.file and req.files to request
   5. Adds req.body for text fields

   Without Multer:   req.file  = undefined
   With Multer:      req.file  = { path, filename, size... }
*/