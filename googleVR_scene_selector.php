<?php

	$scena = $_GET['scena'];

	switch ($scena) {
		case 1:
			$path = "../olga_1/olga_1.json";
			break;

		case 2:
			$path = "../olga_2_multi/olga_2.json";
			break;

		case 3:
			$path = "../ninni_2_multi/ninni_2_multi.json";
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
    
    <script src="../vrview-master/build/vrview.js"></script>
    <script>var jsonpath = "<?php echo "$path"; ?>"</script>
    <script src="googleVR_loader.js"></script>
  	
  </body>
</html>