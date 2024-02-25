
varying vec3 vViewPosition;
varying vec3 vSpherePosition;

#include <common>
#include <normal_pars_vertex>


void main() {
  
  #include <beginnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <project_vertex>

	vViewPosition = - mvPosition.xyz;

	vSpherePosition = normalMatrix * normalize(position) ;



	#include <worldpos_vertex>
	
}