<?php
	use App\Models\ClaimModel; // demo only
	$model = new ClaimModel();
?>


<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
</head>
<body>
	<?php
		$jsondata = json_decode($claimdata);
	?>
    <img src="<?php echo $datauri;?>" style="position: absolute; margin-top: 0px; margin-left: -9px; z-index:1;"></img>
    <p style="z-index:2; position:fixed; margin-top:163px; margin-left:95px;"><?php echo $jsondata->claimant_detail->name; ?></p>
    <p style="z-index:2; position:fixed; margin-top:163px; margin-left:460px;"><?php echo $jsondata->claimant_detail->designation; ?></p>
    <p style="z-index:2; position:fixed; margin-top:190px; margin-left:145px;"><?php echo $jsondata->claimant_detail->department; ?></p>
    <p style="z-index:2; position:fixed; margin-top:190px; margin-left:430px;">
	<?php
		$claimdate = date_create($jsondata->claimant_detail->date);
		echo date_format($claimdate, "d-m-Y");
	?>
	</p>
	<p style="z-index:2; position:fixed; margin-top:272px; margin-left:38px;">
	REFER WO:
	<?php
		$wo_count = sizeof($jsondata->claim_detail);
		for ($i=0; $i<$wo_count; $i++) {
			echo $jsondata->claim_detail[$i]->wo_no;
			if ($i+1<$wo_count) {
				echo ",&nbsp;&nbsp;&nbsp;";
			}
		}
	?>
	</p>
	<p style="z-index:2; text-align: right; position:fixed; margin-top:775px; margin-right:50px;">
	<?php
		echo $model->toRM($jsondata->grandtotal);
	?>
	</p>
	<!-- CLAIM ITEM LISTINGS -->
	<?php
		// new calculations
		$set_opening = 380;
		$set_closing = 0;
		$set_gap = 10; // default
		$fontsize = 9;
		$comp_wo = 0;
		$comp_item = 0;
		
		$wo_margintop = 0;
		$wo_marginleft = 38;
		$wo_gap = 18;
		$item_margintop = 0;
		$item_marginleft = 145;
		$value_marginright = 50;
		$item_gap = 25;

		$item_count = 0;
		
		// looping for WO
		for ($i=0; $i<$wo_count; $i++) {
			$wo_margintop = $item_margintop = $set_opening;
			echo "<p class=\"wo\" style=\"margin-top:".$wo_margintop."px; margin-left:".$wo_marginleft."px;\">".$jsondata->claim_detail[$i]->wo_no."</p>";
			
			$depdate = date_create($jsondata->claim_detail[$i]->departure_date);
			echo "<p class=\"wo\" style=\"margin-top:".($wo_margintop+$wo_gap)."px; margin-left:".($wo_marginleft+17)."px;\">".date_format($depdate, 'd-m-Y')."</p>";
			
			$deptime = date_create_from_format('Hi', $jsondata->claim_detail[$i]->departure_time);
			echo "<p class=\"wo\" style=\"margin-top:".($wo_margintop+$wo_gap*2)."px; margin-left:".($wo_marginleft+20)."px;\">".date_format($deptime, 'h:i A')."</p>";
			echo "<p class=\"wo\" style=\"margin-top:".($wo_margintop+$wo_gap*3)."px; margin-left:".($wo_marginleft+41)."px;\">to</p>";
			
			$retdate = date_create($jsondata->claim_detail[$i]->return_date);
			echo "<p class=\"wo\" style=\"margin-top:".($wo_margintop+$wo_gap*4)."px; margin-left:".($wo_marginleft+17)."px;\">".date_format($retdate, 'd-m-Y')."</p>";
			
			$rettime = date_create_from_format('Hi', $jsondata->claim_detail[$i]->return_time);
			echo "<p class=\"wo\" style=\"margin-top:".($wo_margintop+$wo_gap*5)."px; margin-left:".($wo_marginleft+20)."px;\">".date_format($rettime, 'h:i A')."</p>";
			$set_closing = $wo_margintop+($wo_gap*5)+($fontsize*5);
			$set_opening = $set_closing + $set_gap;
			$comp_wo = $set_closing;
			
			// looping for items
			$item_count = sizeof($jsondata->claim_detail[$i]->items);
			
			for ($j=0; $j<$item_count; $j++) {
				$description = $model->generateDescription($jsondata->claim_detail[$i]->items[$j]);
				$value = $model->toRM($jsondata->claim_detail[$i]->items[$j]->value);
				$line = $item_margintop+$j*$item_gap;
				echo nl2br("<p class=\"wo\" style=\"width:400px; margin-top:".$line."px; margin-left:".$item_marginleft."px;\">".$description."</p>");
				echo "<p class=\"wo\" style=\"text-align:right; margin-top:".$line."px; margin-right:".$value_marginright."px;\">".$value."</p>";
				if (strlen($description)>66) {
					$item_margintop = $item_margintop + 18;
					$newlines = substr_count($description, "\n");
					if ($newlines>1) {
						$item_margintop = $item_margintop + 10*$newlines;
					}
				}
			}
			$set_closing = $item_margintop+($item_gap*$item_count)+($fontsize*$item_count);
			$comp_item = $set_closing;
			
			if ($comp_item>$comp_wo) {
				$set_opening = $comp_item;
			} else {
				$set_opening = $comp_wo;
			}
			
		}
	?>
	<style>
		.wo {
			font-size: 14px;
			z-index: 3;
			position: fixed;
		}
	</style>
</body>
</html>