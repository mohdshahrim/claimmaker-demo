<?php namespace App\Models;

use CodeIgniter\Model;

class PdfModel extends Model
{
    public function getPdfData()
    {
        $image = 'img/srf.png';
        $type = pathinfo($image, PATHINFO_EXTENSION);
        $data = file_get_contents($image);
        $dataUri = 'data:image/' . $type . ';base64,' . base64_encode($data);
        return $dataUri;
    }
	
	public function getClaimform()
	{
        $image = 'img/claimform.png';
        $type = pathinfo($image, PATHINFO_EXTENSION);
        $data = file_get_contents($image);
        $dataUri = 'data:image/' . $type . ';base64,' . base64_encode($data);
        return $dataUri;		
	}
	
	public function wordingTest($data) {
		return "This is data ".$data;
	}
}