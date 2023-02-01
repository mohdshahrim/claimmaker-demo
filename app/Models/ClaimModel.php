<?php namespace App\Models;

use CodeIgniter\Model;

class ClaimModel extends Model
{
	
	public function generateDescription($data)
	{	
		$description = "";
		switch($data->type)
		{
			case "subsistence":
				$description = $this->generateSubsistence($data);
				break;
			case "lodging":
				$description = $this->generateLodging($data);
				break;
			case "ticket":
				$description = $this->generateTicket($data);
				break;
			case "reload":
				$description = $this->generateReload($data);
				break;
			case "other":
				$description = $this->generateOther($data);
				break;
			default:
				$description = "TEHEE";
				break;
		}
		return $description;
	}

	
	private function generateSubsistence($data)
	{
		return "Subsistence Allowance @ RM".$this->toRM($data->rate)." per day, ".$this->toDays($data->quantity)." days";
	}
	
	
	public function generateLodging($data)
	{
		return "Lodging Allowance @ RM".$this->toRM($data->rate)." per night, ".$data->quantity." nights";
	}
	

	public function generateTicket($data)
	{
		return $data->mode." fare ".$data->origin." to ".$data->destination.", Ticket No. ".$data->ticketno;
	}


	public function generateReload($data)
	{
		return "Being claim for ".$data->telco." reload coupon for ".$this->toMonthYear($data->monthyear).", Receipt no. ".$data->serialno." (".$data->telno.")";
	}


	public function generateOther($data)
	{
		$str = $data->desc.", ".$data->quantity;
		return $str;
	}
	
	
	public function toRM($data)
	{
		$new = $data/100;
		return number_format($new ,2);
	}
	
	
	private function toDays($data)
	{
		$new = (int)$data;
		if (fmod($data,1) == 0.5)
		{
			if ($new==0)
			{
				return "½";
			}
			else
			{
				return $new."½";
			}
		}
		else
		{
			return (int)$data;
		}
	}


	public function toMonthYear($monthyear)
	{
		$d = date_create_from_format("Y-m", $monthyear);
		return $d->format('M Y');
	}


}


?>