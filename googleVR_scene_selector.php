<?php

	$scena = $_GET['scena'];

	switch ($scena) {
		case 1:
			$path = "../olga_1/scene.json";
			break;

		case 2:
			$path = "../olga_2_multi/scene.json";
			break;

		case 3:
			$path = "../ninni_2_multi/scene.json";
			break;
	}

	
?>

<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Web VR</title>
    
  </head>
  <body>

  	<div id="vrview"></div>
    
    <script src="../vrview/build/vrview.js"></script>
    <script>var jsonpath = "<?php echo "$path"; ?>"</script>
    <script src="googleVR_loader.js"></script>
  	
  </body>
</html>