const cloudinary = require("./../config/cloudinary");

async function UploadImage(temp_img_path) {
  const result = await cloudinary.uploader.upload(temp_img_path, {
    folder: "posts",
  });
  console.log(result);

  return {
    public_id: result?.public_id,
    url: result?.url,
  };
}

async function DeleteImage(
  public_id,
  resourse_type = "image" | "raw" | "video",
) {
  const result = await cloudinary.uploader.destroy(public_id, {
    resourse_type: resourse_type,
  });

  return result;
}

module.exports = { UploadImage, DeleteImage };

// exanoke response
// {
//   asset_id: '8d7c1a47570770c8fa16f7dcee0cbb81',
//   public_id: 'psqjxl5xlggof5epbq36',
//   version: 1784381852,
//   version_id: 'df01ffd15bf4fe4f1dfbc81226050e15',
//   signature: 'e8809e2228eabcfe1e809a5d4f34ffdd66a97220',
//   width: 720,
//   height: 480,
//   format: 'avif',
//   resource_type: 'image',
//   created_at: '2026-07-18T13:37:32Z',
//   tags: [],
//   pages: 1,
//   bytes: 46514,
//   type: 'upload',
//   etag: '5e178a571ec6ab474ab739fd0c261f8b',
//   placeholder: false,
//   url: 'http://res.cloudinary.com/bc8tk53v/image/upload/v1784381852/psqjxl5xlggof5epbq36.avif',
//   secure_url: 'https://res.cloudinary.com/bc8tk53v/image/upload/v1784381852/psqjxl5xlggof5epbq36.avif',
//   asset_folder: '',
//   display_name: 'psqjxl5xlggof5epbq36',
//   original_filename: 'tmp-1-37361784381846038',
//   api_key: '163924592777926'
// }
