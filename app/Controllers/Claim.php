<?php namespace App\Controllers;


use CodeIgniter\Controller;
use App\Models\PdfModel;
use Dompdf\Dompdf;
use Dompdf\Options;


class Claim extends Controller
{


    public function index()
    {
        echo view('header');
        echo view('claim/main');
        echo view('footer');
    }


    public function generatepdf() {
        if ($this->request->getMethod() === 'post' && $this->validate([
            'claimdata' => 'required',
        ]))
        {
            $data['claimdata'] = $this->request->getPost('claimdata');

            $model = new PdfModel();
            // instantiate and use the dompdf class
            $dompdf = new Dompdf();
            $data['datauri'] = $model->getClaimform();
            $dompdf->loadHtml(view('claim/pdf', $data));
    
            // (Optional) Setup the paper size and orientation
            $dompdf->setPaper('A4', 'portrait');
    
            // Render the HTML as PDF
            $dompdf->render();
    
            // Output the generated PDF to Browser
            //return $dompdf->stream("SRF");
            $jsondata = json_decode($data['claimdata']);
            $claimdate = date_create($jsondata->claimant_detail->date);
            //$claimname = strtoupper(substr($data["claimdata"]->claimant_detail->name,0,5));
            $claimname = $jsondata->claimant_detail->name;
            return $dompdf->stream("CLM".date_format($claimdate, "Ymd")."_".strtoupper(substr($claimname,0,5)));
        }
        else
        {
            return redirect()->to('/');
        }
    }


}

?>