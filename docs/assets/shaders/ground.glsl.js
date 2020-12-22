

---
name: ground
type: fragment
---

precision mediump float;

uniform vec2 resolution;

varying vec2 fragCoord;

void main() {
	vec2 position = fragCoord.xy / resolution.xy;
	vec2 center = vec2(0.5, 0.5);
	float distance = length(position - center);

	vec3 color1 = vec3(1.0, 0.0, 0.0);
	vec3 color2 = vec3(0.0, 1.0, 1.0);

	float cell = 16.0;
	float stepX = floor((fragCoord.x) / cell);
	float stepY = floor((fragCoord.y) / cell);
	vec4 color;

	if(mod(stepX, 2.0) == 0.0) {
		if(mod(stepY, 2.0) == 0.0) {
			color = vec4(color2, 1.0);
		} else if(mod(stepY, 2.0) == 1.0) {
			color = vec4(color1, 1.0);
		}
	} else if(mod(stepX, 2.0) == 1.0) {
		if(mod(stepY, 2.0) == 0.0) {
			color = vec4(color1, 1.0);
		} else if(mod(stepY, 2.0) == 1.0) {
			color = vec4(color2, 1.0);
		}
	}

	vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
	vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
	vec4 gradient = mix(white, black, smoothstep(0.0, 1.0, distance));

	gl_FragColor = (gradient + color) / 2.0;
}