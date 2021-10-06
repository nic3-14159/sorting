//set up canvas to allow drawing
var ctx = document.getElementById("canvas").getContext("2d");
var array;
var width;
var length;
var delay = 100;
ctx.strokeStyle="#000000";

function generateArray(number) {
	array = [];
	for (var i=0; i<number; i++) {
		array[i] = i+1;
	}
	width = 550/array.length;
	length = 400/largest(array);
	ctx.clearRect(0,0,550,400);
	ctx.lineWidth = width*0.2;
	display(array,0,array.length,0,false);	
}

function sort(algorithm) {
	//var array = randomArray(document.getElementById("num").value);
	switch (algorithm) {
		case "bubble":
			bubbleSort(array);
			break;
		case "select":
			selectionSort(array);
			break;
		case "insert":
			insertionSort(array);
			break;
		case "merge":
			mergeSort(array);
			break;
		case "radix":
			radixSort(array);
			break;
		case "quick":
			quickSort(array);
			break;
		case "weird":
        		weird(array);
        		break;
	}
}

function randomizeArray() {
	var number = document.getElementById("num").value;
	// swap random elements 1000 times
	for (var i=0; i<1000; i++) {
		var index1 = Math.floor(Math.random() * Math.floor(number));
		var index2 = Math.floor(Math.random() * Math.floor(number));
		var temp = array[index1];
		array[index1] = array[index2];
		array[index2] = temp;
	}
	ctx.clearRect(0,0,550,400);
	display(array,0,array.length,0,false);
}

//function that displays an array on the canvas
async function display(array, start, end, useDelay){
	ctx.fillStyle="hsl(120, 100%, 50%)";
	// sequentially draw each element, with an optional delay
	// between each draw
	for (var x=0; x<array.length; x++){
		ctx.fillStyle=`hsl(${280*(array[x]*length)/400}, 100%, 50%)`;
		ctx.clearRect(Math.ceil(x*width),400,Math.ceil(width),-400);
		ctx.fillRect(Math.ceil(x*width),400,Math.ceil(width),array[x]*-length);
		if (useDelay) {
			await sleep(delay);
		}
	}
}

//sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//finds largest number in array
function largest(array){
	max = array[0];
	for (var i=0; i< array.length; i++){
		if (array[i] > max){
			max = array[i];
		}
	}
	return max;
}

//bubblesort function
async function bubbleSort(array){
	ctx.clearRect(0,0,550,400);
	var sorted;
	var end = array.length-1;
	do {
		sorted = true;
		for (var i=0; i<end; i++){
			await display(array, 0, array.length, false);
			ctx.strokeRect(Math.ceil(i*width),400,Math.ceil(width),array[i]*-length);
			ctx.strokeRect(Math.ceil((i+1)*width),400,Math.ceil(width),array[i+1]*-length);
			await sleep(delay)
			if (array[i] > array[i+1]){
				var temp = array[i];
				array[i] = array[i+1];
				array[i+1] = temp;
				sorted = false;
				await display(array, 0, array.length, false);
				ctx.strokeRect(Math.ceil(i*width),400,Math.ceil(width),array[i]*-length);
				ctx.strokeRect(Math.ceil((i+1)*width),400,Math.ceil(width),array[i+1]*-length);
				await sleep(delay)
			}
		}
		end--;
	}
	while (!sorted);
	display(array,0,array.length, false);
}

async function weird(array){
	ctx.clearRect(0,0,550,400);
	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array.length; j++) {
			await display(array, 0, array.length, false);
			ctx.strokeRect(Math.ceil(i*width),400,Math.ceil(width),array[i]*-length);
			ctx.strokeRect(Math.ceil(j*width),400,Math.ceil(width),array[j]*-length);
			await sleep(delay);
			if (array[i] < array[j]) {
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
				await display(array, 0, array.length, false);
				ctx.strokeRect(Math.ceil(i*width),400,Math.ceil(width),array[i]*-length);
				ctx.strokeRect(Math.ceil(j*width),400,Math.ceil(width),array[j]*-length);
				await sleep(delay);
			}
		}
	}
	display(array, 0, array.length, false);
}

//radix sort function
async function radixSort(array){
	var max = largest(array);
	ctx.clearRect(0,0,550,400);
	var buckets = [[],[],[],[],[],[],[],[],[],[]];
	var digits = 0;//used to check for code completion
	var place = 0;//which power of 10 to check
	do {
		digits = 0;
		for (var i = 0; i<array.length; i++){
			buckets[parseInt(array[i]/10**place) % 10].push(array[i]);
			digits += parseInt(array[i]/10**place) % 10;
		}
		array = [];
		for (var bucket = 0; bucket < 10; bucket++){
			for (var i = 0; i < buckets[bucket].length; i++){
				array.push(buckets[bucket][i]);
			}
		}
		await display(array, 0, array.length, true);
		place += 1;
		buckets = [[],[],[],[],[],[],[],[],[],[]];
	}
	while (digits !== 0);
	return array;
}

//-------------mergesort functions-----------------
async function mergeSort(array, start=0, end=array.length, nest=0){
	if(nest === 0){
		await display(array, 0, array.length, true);
	}
	if(start < end-1) {
		await mergeSort(array, start, Math.ceil((end-start)/2)+start, nest+1);
		await mergeSort(array, Math.ceil((end-start)/2)+start, end, nest+1);
		await merge(array, start, end);
	}
}

async function merge(array, start, end, delay) {
	part1 = array.slice(start,Math.ceil((end-start)/2)+start);
	part2 = array.slice(Math.ceil((end-start)/2)+start,end);
	for (var i = start; i<end; i++){
		if (part1[0] >= part2[0] || part1.length === 0){
			array[i] = part2.splice(0,1)[0];
		} else if (part1[0] < part2[0] || part2.length === 0){
			array[i] = part1.splice(0,1)[0];
		}
	}
	await display(array, start, end, true);
}
//-----------end of mergesort functions-----------------

//selection sort function
async function selectionSort(array){
	ctx.clearRect(0,0,550,400);
	for (var i = 0; i<array.length; i++){//loops through the unsorted section
		var minimum = i;
		// Find smallest element in unsorted section of array
		for (var check = i+1; check < array.length; check++) {
			if (array[check] < array[minimum]){//if the digit being checked is smaller than the current smallest
				minimum = check;
			}
		}
		array.splice(i,0,array.splice(minimum,1)[0]);//moves the smallest digit to the end of the sorted section
		await display(array, 0, array.length, true);
		await sleep(delay);
	}
	return array;
}

//insertion sort function
async function insertionSort(array){
	ctx.clearRect(0,0,550,400);
	// i represents start of unsorted section of array
	for (var i = 0; i<array.length; i++) {
		var count = i;
		while (count != 0 && array[count] < array[count-1]) {
			await display(array, 0, array.length, false);
			ctx.strokeRect(Math.ceil(count*width),400,Math.ceil(width),array[count]*-length);
			ctx.strokeRect(Math.ceil((count-1)*width),400,Math.ceil(width),array[count-1]*-length);
			await sleep(delay);
			var temp = array[count];
			array[count] = array[count-1];
			array[count-1] = temp;
			await display(array, 0, array.length, false);
			ctx.strokeRect(Math.ceil(count*width),400,Math.ceil(width),array[count]*-length);
			ctx.strokeRect(Math.ceil((count-1)*width),400,Math.ceil(width),array[count-1]*-length);
			await sleep(delay);
			count--;
		}
	}
	return array;
}

//quicksort function
async function quickSort(array, start=0, end=array.length, nest=0){
	if (nest === 0){
		ctx.clearRect(0,0,550,400);
	}
	await display(array, start, end, false);
	if (end - start > 1){
		var pivotIndex = Math.floor((end-start)/2+start);
		var pivotValue = array[pivotIndex];
		var high = end-1;
		var low = start;
		ctx.strokeStyle = "#FF0000";
		ctx.strokeRect(Math.ceil(pivotIndex*width),400,Math.ceil(width),array[pivotIndex]*-length);
		ctx.strokeStyle = "#000000";
		ctx.strokeRect(Math.ceil(low*width),400,Math.ceil(width),array[low]*-length);
		ctx.strokeRect(Math.ceil(high*width),400,Math.ceil(width),array[high]*-length);
		while (high > low){
			while (array[low] < pivotValue && high > low) {
				low++;
				await display(array, start, end, false);
				ctx.strokeStyle = "#FF0000";
				ctx.strokeRect(Math.ceil(pivotIndex*width),400,Math.ceil(width),array[pivotIndex]*-length);
				ctx.strokeStyle = "#000000";
				ctx.strokeRect(Math.ceil(low*width),400,Math.ceil(width),array[low]*-length);
				ctx.strokeRect(Math.ceil(high*width),400,Math.ceil(width),array[high]*-length);
				await sleep(delay);
			}
			while (array[high] > pivotValue && high > low) {
				high--;
				await display(array, start, end, false);
				ctx.strokeStyle = "#FF0000";
				ctx.strokeRect(Math.ceil(pivotIndex*width),400,Math.ceil(width),array[pivotIndex]*-length);
				ctx.strokeStyle = "#000000";
				ctx.strokeRect(Math.ceil(low*width),400,Math.ceil(width),array[low]*-length);
				ctx.strokeRect(Math.ceil(high*width),400,Math.ceil(width),array[high]*-length);
				await sleep(delay);
			}
			var temp = array[low];
			array[low] = array[high];
			array[high] = temp;
			await display(array, start, end, false);
			ctx.strokeStyle = "#FF0000";
			ctx.strokeRect(Math.ceil(pivotIndex*width),400,Math.ceil(width),array[pivotIndex]*-length);
			ctx.strokeStyle = "#000000";
			ctx.strokeRect(Math.ceil(low*width),400,Math.ceil(width),array[low]*-length);
			ctx.strokeRect(Math.ceil(high*width),400,Math.ceil(width),array[high]*-length);
			await sleep(delay);
		}
		await display(array, start, end, false);
		await quickSort(array, start, low, nest+1);
		await quickSort(array, low+1, end, nest+1);
	}
}
document.getElementById("num").onchange = function() {generateArray(this.value);}
document.getElementById("delay").onchange = function() {delay = this.value;}
document.getElementById("randomize").onclick = function() {randomizeArray();}
document.getElementById("bubble").onclick = function() {sort("bubble");}
document.getElementById("select").onclick = function() {sort("select");}
document.getElementById("insert").onclick = function() {sort("insert");}
document.getElementById("merge").onclick = function() {sort("merge");}
document.getElementById("radix").onclick = function() {sort("radix");}
document.getElementById("quick").onclick = function() {sort("quick");}
document.getElementById("weird").onclick = function() {sort("weird");}
document.getElementById("num").onchange();
document.getElementById("delay").onchange();
