using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http.Features;
namespace RTEImageWebAPI.Controllers
{
    [Route("api/[controller]")]
    public class RichTextEditorController : Controller
    {
        // Interface that provides Provides information about the web hosting environment an application is running in.
        // WebRootPath - Path of the www folder(Gets or sets the absolute path to the directory that contains the web-servable application content files)
        // ContentRootPath − Path of the root folder which contains all the Application files(Gets or sets an IFileProvider pointing at WebRootPath.)
        // To Learn more click here https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.hosting.iwebhostenvironment?view=aspnetcore-7.0

        private readonly IWebHostEnvironment _webHostEnvironment;
        private int count = 1;
        public RichTextEditorController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }
        // To rename the files that are recieved on the server.
        // Step 1: Change the Controllder to RenameFile
        // Step 2: Handle the client side file renaming using the imageUploadSuccess event.

        [AcceptVerbs("Post")]
        [EnableCors("AllowAllOrigins")]
        [Route("SaveFile")]
        public IActionResult SaveFile(IList<IFormFile> UploadFiles)
        {
            try
            {
               foreach (IFormFile uploadFile in UploadFiles)
               {
                    // To get the file name from the header using the ContentDispositionHeaderValue class.
                    // https://learn.microsoft.com/en-us/dotnet/api/microsoft.net.http.headers.contentdispositionheadervalue?view=aspnetcore-7.0

                    string fileName = ContentDispositionHeaderValue.Parse(uploadFile.ContentDisposition).FileName.Trim('"');

                    // Construct the full path to save the file
                    fileName = Path.Combine(_webHostEnvironment.WebRootPath, "images", fileName);

                    // Check if the file doesn't exist and create it
                    if (!System.IO.File.Exists(fileName))
                    {
                        using (FileStream fs = System.IO.File.Create(fileName))
                        {
                            uploadFile.CopyTo(fs);
                            fs.Flush();
                        }

                        return Ok();
                    }
               }
            } catch (Exception ex)
            {
                Response.Clear();

                Response.ContentType = "application/json; charset=utf-8";

                Response.StatusCode = 204;

                Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = "No Content";

                Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = ex.Message;

                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
            // Add a return statement here to handle the case when no file is found.
            return StatusCode(500, $"An error occurred.");
        }

        [AcceptVerbs("Post")]
        [EnableCors("AllowAllOrigins")]
        [Route("RenameFile")]
        public IActionResult RenameFile(IList<IFormFile> UploadFiles)
        {
            try
            {
                foreach (IFormFile uploadFile in UploadFiles)
                {
                    // To get the file name from the header using the ContentDispositionHeaderValue class.
                    // https://learn.microsoft.com/en-us/dotnet/api/microsoft.net.http.headers.contentdispositionheadervalue?view=aspnetcore-7.0

                    string fileName = ContentDispositionHeaderValue.Parse(uploadFile.ContentDisposition).FileName.Trim('"');
                    string fileExtension = Path.GetExtension(fileName);
                    string baseFileName = "RTE_Image_";

                    string newFileName = baseFileName + count + fileExtension;

                    while (System.IO.File.Exists(Path.Combine(_webHostEnvironment.WebRootPath, "images", newFileName)))
                    {
                        count++;
                        newFileName = baseFileName + count + fileExtension;
                    }

                    // Construct the full path to save the file
                    string filePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", newFileName);

                    // Save the renamed file
                    using (FileStream fs = System.IO.File.Create(filePath))
                    {
                        uploadFile.CopyTo(fs);
                        fs.Flush();
                    }

                    return Ok();
                }
            }
            catch (Exception ex)
            {
                Response.Clear();
                Response.ContentType = "application/json; charset=utf-8";
                Response.StatusCode = 204;
                Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = "No Content";
                Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = ex.Message;
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
            // Add a return statement here to handle the case when no file is found.
            return StatusCode(500, $"An error occurred.");
        }

        [AcceptVerbs("Post")]
        [EnableCors("AllowAllOrigins")]
        [Route("DeleteFile")]
        public IActionResult DeleteFile(IList<IFormFile> UploadFiles)
        {
            try
            {
                foreach (IFormFile uploadFile in UploadFiles)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(uploadFile.ContentDisposition).FileName.Trim('"');

                    string filePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", fileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                        return Ok($"File '{fileName}' has been deleted.");
                    }
                    else
                    {
                        return NotFound($"File '{fileName}' not found.");
                    }
                }
            }
            catch (Exception ex)
            {
                Response.Clear();
                Response.ContentType = "application/json; charset=utf-8";
                Response.StatusCode = 204;
                Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = "No Content";
                Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = ex.Message;
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
            return StatusCode(500, $"An error occurred.");

        }
    }
}
