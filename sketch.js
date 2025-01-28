let weatherJSON;
let minTemp = Infinity; // Global declaration
let maxTemp = -Infinity; // Global declaration
let dx;
let images = {}

function preload() {
  weatherJSON = loadJSON("https://api.weather.gov/gridpoints/OKX/33,37/forecast");
}

function setup() {
  createCanvas(600, 400);
  dx = width / (weatherJSON.properties.periods.length + 1);

  // Find min and max temperatures (to be used in draw)
  for (const p of weatherJSON.properties.periods) {
    minTemp = min(p.temperature, minTemp);
    maxTemp = max(p.temperature, maxTemp);
  }

  noLoop(); 
}

function draw() {
  background(220);

  // Title
  textSize(16);
  textAlign(CENTER);
  text("Temperature Trends for Upcoming Days", width / 2, 30);

  // Y-axis label
  push();
  textSize(12);
  textAlign(CENTER);
  translate(20, height / 2);
  rotate(-PI / 2);
  text("Temperature (°F)", 0, 0);
  pop();

  // X-axis label
  textSize(12);
  textAlign(CENTER);
  text("Days", width / 2, height - 10);

  //Grid lines and y-axis ticks
  for (let t = minTemp; t <= maxTemp; t += 5) {
    let y = map(t, minTemp, maxTemp, 0.8 * height, 0.2 * height);
    stroke(200);
    line(40, y, width, y);
    noStroke();
    fill(0);
    textAlign(RIGHT, CENTER);
    text(t, 35, y);
  }

  // Line graph
  let px = dx;
  let py = map(weatherJSON.properties.periods[0].temperature, minTemp, maxTemp, 0.8 * height, 0.2 * height);
  for (let i = 1; i < weatherJSON.properties.periods.length; i++) {
    let cx = dx * (i + 1);
    let cy = map(weatherJSON.properties.periods[i].temperature, minTemp, maxTemp, 0.8 * height, 0.2 * height);
    stroke(0);
    line(px, py, cx, cy);
    px = cx;
    py = cy;

    // Graph understanding components (makes you understand graph)
    push();
    noStroke();
    fill(0);
    textSize(14); // Increase font size
    textStyle(BOLD); // Make text bold
    textAlign(LEFT, CENTER);
    translate(cx, 0.85 * height + 20); // Add more spacing for words 
    rotate(-PI / 3); // Rotate text by 60° for space 
    text(weatherJSON.properties.periods[i].name, 0, 0);
    pop();
    //Temperature Values
    textAlign(LEFT, BOTTOM);
    textSize(12); // Keep temperature values smaller
    text(weatherJSON.properties.periods[i].temperature + "°F", cx + 5, cy - 5);
  }
}
