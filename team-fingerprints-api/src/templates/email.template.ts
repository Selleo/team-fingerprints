export const emailtemplate = (
  message = 'Welcome to Selleo Team Fingerprints',
  url = 'https://teamfingerprints.selleo.com/',
) => `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap" rel="stylesheet">

  <style>
    *{
      margin: 0;
      padding: 0;
    }

    body {
      max-width: 1000px;
      font-family: 'Poppins', sans-serif;
      color: white;
    }
  </style>

</head>
  <body>
    <div style="width: 50%; height: 20vh; background-color: #121212; color: white; padding: 10px; box-sizing: border-box;">
      <img src='https://teamfingerprints.selleo.com/fingerprints.logo.png' style="width: 40%; margin: 20px 10px;">
      <h3 style="color: white; margin: 10px;">${message}</h3>
      <a href="${url}" style="color: #32A89C; text-decoration: none; margin-left: 10px;" target="blank">Open Team Fingerprints</a>
    </div>
  </body>
</html>
`;
