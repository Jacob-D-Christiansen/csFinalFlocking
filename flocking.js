var triPosition = 0.0;

function main(){
    var canvas = document.getElementById('canvas');
    gl = canvas.getContext('experimental-webgl');
    
    var xTrans = 0.0;
    var yTrans = 0.0;
        
    var Sx = 1.0, Sy = 1.0, Sz = 1.0;
    var scaleMatrix = new Float32Array([
        Sx,  0.0,  0.0,  0.0,
        0.0,  Sy,   0.0,  0.0,
        0.0,  0.0,  Sz,   0.0,
        0.0,  0.0,  0.0,  1.0  
    ]);
         
    var vertices = [
            -0.5, 0.0,0.0,
             0.5, 0.5,0.0,
             0.5,-0.5,0.0,
            -0.8, 0.0,0.0,
             0.8, 0.8,0.0,
             0.8,-0.8,0.0, 
        ];
         
    indices = [0,1,2];
         
         // Create an empty buffer object to store vertex buffer
    var vertex_buffer = gl.createBuffer();

        // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
         
         // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

         // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
         // Create an empty buffer object to store Index buffer
    var Index_Buffer = gl.createBuffer();

         // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

         // Pass the vertex data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
         
         // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

         /*================ Shaders ====================*/  
         // Vertex shader source code
     var vertCode =
         'attribute vec3 coordinates;' +
				
         'void main(void) {' +
            ' gl_Position = vec4(coordinates, 1.0);' +
         '}';
            
         // Create a vertex shader object
     var vertShader = gl.createShader(gl.VERTEX_SHADER);

         // Attach vertex shader source code
     gl.shaderSource(vertShader, vertCode);

         // Compile the vertex shader
     gl.compileShader(vertShader);

         //fragment shader source code
     var fragCode =
         'void main(void) {' +
         ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
         '}';
            
        // Create fragment shader object
     var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

         // Attach fragment shader source code
     gl.shaderSource(fragShader, fragCode); 
         
         // Compile the fragmentt shader
     gl.compileShader(fragShader);

         // Create a shader program object to store
         // the combined shader program
     var shaderProgram = gl.createProgram();

         // Attach a vertex shader
     gl.attachShader(shaderProgram, vertShader);

         // Attach a fragment shader
     gl.attachShader(shaderProgram, fragShader);

         // Link both the programs
     gl.linkProgram(shaderProgram);

         // Use the combined shader program object
     gl.useProgram(shaderProgram);

         /*======= Associating shaders to buffer objects =======*/

         // Bind vertex buffer object
     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

         // Bind index buffer object
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
         
         // Get the attribute location
     var coord = gl.getAttribLocation(shaderProgram, "coordinates");

         // Point an attribute to the currently bound VBO
     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); 
         
         // Enable the attribute
     gl.enableVertexAttribArray(coord);

         /*=========Drawing the triangle===========*/

         // Clear the canvas
     gl.clearColor(0.5, 0.5, 0.5, 0.9);

         // Enable the depth test
     gl.enable(gl.DEPTH_TEST);

         // Clear the color buffer bit
     gl.clear(gl.COLOR_BUFFER_BIT);

         // Set the view port
     gl.viewport(0,0,canvas.width,canvas.height);

         // Draw the triangle
     gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
     
     function draw(t){
        // Draw a triangle
          var u_transformation = gl.getUniformLocation(shaderProgram,"u_transformation");
          gl.uniform4fv(u_transformation,[xTrans,yTrans,0,0]);
          var u_scale = gl.getUniformLocation(shaderProgram,"u_scale");
          gl.uniformMatrix4fv(u_scale,false,scaleMatrix);

          gl.clearColor(0.8, 0.8, 0.8, 1.0);

          gl.enable(gl.DEPTH_TEST);

          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.viewport(0, 0, canvas.width, canvas.height);
          
          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
          xTrans += t;
        }

        var then = 0;

        function next_frame(time){
          time *= 0.001;
          var deltaTime = time - then;
          then = time;
          draw(deltaTime);
          requestAnimationFrame(next_frame);
        }
        requestAnimationFrame(next_frame);
}

window.onload = main;
