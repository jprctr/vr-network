/* global document, Flourish */

/*
  file: legend.js
  description: Generates legend area objects
  company: Pitch Interactive
  author: James Proctor
  license: MIT
*/

import * as THREE from 'three';
import MeshLine from '../../three_modules/THREE.MeshLine';
import { generateTextureCanvas } from '../actions/generateTextureCanvas';
import { generateCurveGeometry } from '../actions/generateCurveGeometry';

const textureLoader = new THREE.TextureLoader();
const imgGeometry = new THREE.PlaneGeometry(256, 256);

export function generate(state, lineMaterials, userHeight) {
  const container = new THREE.Group();

  const image = document.createElement('img');
  const texture = new THREE.Texture(image);
  image.onload = () => { texture.needsUpdate = true; };
  image.src = state.logo;

  const geometry = new THREE.PlaneGeometry(512, 128);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    map: texture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(0.001, 0.001, 0.001);
  mesh.position.set(0, 0.25, 0);
  container.add(mesh);

  const inLineCurve = generateCurveGeometry(
    new THREE.Vector3(-0.3, 0.0, 0.0),
    new THREE.Vector3(0.3, 0.0, 0.0),
    userHeight / 2,
  );
  const inLineGeometry = inLineCurve.lineGeometry;
  const inLineLength = inLineCurve.lineLength;
  const inLine = new MeshLine();
  inLine.setGeometry(inLineGeometry);
  const inLineLengths = new Float32Array(inLine.geometry.attributes.position.count)
    .fill(inLineLength);
  inLine.geometry.addAttribute('lineLength', new THREE.Float32BufferAttribute(inLineLengths, 1));

  const inLineMesh = new THREE.Mesh(inLine.geometry, lineMaterials.highlightIn);
  inLineMesh.userData.type = 'in';
  container.add(inLineMesh);

  const inText = generateTextureCanvas(state.legendInboundLabel, 36, 1024, 256);
  inText.scale.set(0.001, 0.001, 0.001);
  inText.position.set(0.025, 0, 0);
  container.add(inText);

  const outLineCurve = generateCurveGeometry(
    new THREE.Vector3(0.3, -0.2, 0.0),
    new THREE.Vector3(-0.3, -0.2, 0.0),
    userHeight / 2,
  );
  const outLineGeometry = outLineCurve.lineGeometry;
  const outLineLength = outLineCurve.lineLength;
  const outLine = new MeshLine();
  outLine.setGeometry(outLineGeometry);
  const outLineLengths = new Float32Array(outLine.geometry.attributes.position.count)
    .fill(outLineLength);
  outLine.geometry.addAttribute('lineLength', new THREE.Float32BufferAttribute(outLineLengths, 1));
  const outLineMesh = new THREE.Mesh(outLine.geometry, lineMaterials.highlightOut);
  outLineMesh.userData.type = 'out';
  container.add(outLineMesh);

  const outText = generateTextureCanvas(state.legendOutboundLabel, 36, 1024, 256);
  outText.scale.set(0.001, 0.001, 0.001);
  outText.position.set(0.025, -0.2, 0);
  container.add(outText);

  const infoMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`${Flourish.static_prefix}/info.png`),
    transparent: true,
    depthTest: false,
  });
  const info = new THREE.Mesh(imgGeometry, infoMaterial);
  info.name = 'info';
  info.userData.type = 'button';
  info.scale.set(0.0005, 0.0005, 0.0005);
  info.position.set(0, -0.35, 0);
  container.add(info);

  const made = generateTextureCanvas('Made by Pitch Interactive with Google News Lab', 36, 1024, 128);
  made.scale.set(0.001, 0.001, 0.001);
  made.position.set(0.45, -0.5, 0);
  container.add(made);

  container.name = 'legend';
  container.userData.name = 'info';
  container.userData.type = 'button';
  container.position.set(-0.45, 0.6, -0.8);
  container.rotation.set((Math.PI / 180) * -45, 0, 0);

  return container;
}

export default generate;
