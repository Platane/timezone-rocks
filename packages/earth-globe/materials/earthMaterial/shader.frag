


#include <common>
#include <lights_pars_begin>
#include <normal_pars_fragment>

varying vec3 vViewPosition;
varying vec3 vSpherePosition;


void main() {


  float lightIntensity = 0.0;

#include <normal_fragment_begin>


  #if ( NUM_DIR_LIGHTS > 0 ) 

    IncidentLight directLight;
    DirectionalLight directionalLight;
    float dotNL;

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

      directionalLight = directionalLights[ i ];

      getDirectionalLightInfo( directionalLight, directLight );

      dotNL = dot( normal, -directLight.direction );

      lightIntensity += ( dotNL + 1.0 )/2.0;

    }
    #pragma unroll_loop_end

  #endif


  float sunIntensity = -1.0;

  vec3 sunDirectionColor = vec3(0.0,0.0,0.0);

   #if ( NUM_DIR_LIGHTS > 0 ) 

      IncidentLight directLightSun;
      DirectionalLight directionalLightSun;

      vec3 spherePosition = vSpherePosition; 
      normalize(spherePosition);
    
      directionalLightSun = directionalLights[ 0 ];

      getDirectionalLightInfo( directionalLightSun, directLightSun );

      sunIntensity = dot( spherePosition, -directLightSun.direction );

  #endif

  float discreteSunIntensity =  1.0-(float(sunIntensity > -0.1 ) * 0.4 + float(sunIntensity > 0.1 ) * 0.4 +  0.1);

  float l = discreteSunIntensity*0.65 + pow(lightIntensity,1.0) *0.35;

  vec3 emmissiveColor = vec3(125.0/255.0, 156.0/255.0, 86.0/255.0);

  emmissiveColor = emmissiveColor * ( 0.2+ l*0.8) ;
  
  gl_FragColor = vec4(emmissiveColor, 1.0);
  
}