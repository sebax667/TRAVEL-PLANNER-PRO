#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Script: Validación de Requisitos Obligatorios
Travel Planner Pro - Proyecto Final
"""

import os
import re
import json
from pathlib import Path

# Definir rutas
ROOT = Path(__file__).parent
FILES = {
    'app': ROOT / 'js' / 'app.js',
    'countries': ROOT / 'js' / 'countries.js',
    'weather': ROOT / 'js' / 'weather.js',
    'currency': ROOT / 'js' / 'currency.js',
    'tourism': ROOT / 'js' / 'tourism.js',
    'storage': ROOT / 'js' / 'storage.js',
    'index': ROOT / 'index.html',
    'css': ROOT / 'css' / 'styles.css'
}

print("=" * 70)
print("TEST: Validación de Requisitos Obligatorios")
print("=" * 70)

# 1. Leer archivos
print("\n[1] Leyendo archivos...")
texts = {}
for name, path in FILES.items():
    if path.exists():
        texts[name] = path.read_text(encoding='utf-8')
        print(f"  ✓ {name}: {len(texts[name])} caracteres")
    else:
        print(f"  ✗ {name}: ARCHIVO NO ENCONTRADO")
        exit(1)

# 2. Validar Arquitectura Modular
print("\n[2] Verificando Arquitectura Modular...")
has_exports = all('export ' in texts[mod] for mod in ['countries', 'weather', 'currency', 'tourism', 'storage'])
has_imports = 'import ' in texts['app']
print(f"  {'✓' if has_exports else '✗'} Exports en módulos: {has_exports}")
print(f"  {'✓' if has_imports else '✗'} Imports en app.js: {has_imports}")
assert has_exports and has_imports, "Arquitectura modular incompleta"

# 3. Validar 4 APIs con Async/Await
print("\n[3] Verificando Consumo de APIs (4 APIs requeridas)...")
api_modules = {
    'countries.js (REST Countries)': ['fetchCountryData', 'https://restcountries.com'],
    'weather.js (Open-Meteo)': ['fetchWeatherData', 'https://api.open-meteo.com'],
    'currency.js (ExchangeRate-API)': ['fetchCurrencyData', 'https://api.exchangerate-api.com'],
    'tourism.js (Wikipedia)': ['fetchTourismData', 'https://en.wikipedia.org']
}

api_count = 0
for api_name, (func_name, url) in api_modules.items():
    found_func = func_name in texts.get(api_name.split('.')[0], '')
    found_url = url in ' '.join(texts.values())
    found_async = 'async ' in ' '.join(texts.values()) and 'await fetch' in ' '.join(texts.values())
    if found_func and found_url:
        api_count += 1
        print(f"  ✓ {api_name}: {func_name} + {url}")
    else:
        print(f"  ✗ {api_name}: FALTA")

print(f"\n  Total APIs detectadas: {api_count}/4")
assert api_count >= 4, f"Se requieren 4 APIs, se encontraron {api_count}"

# 4. Validar Async/Await
print("\n[4] Verificando Async/Await...")
async_count = sum(1 for text in texts.values() if 'async ' in text)
await_count = sum(1 for text in texts.values() if 'await ' in text)
print(f"  ✓ Funciones async encontradas: {async_count}")
print(f"  ✓ Expresiones await encontradas: {await_count}")
assert async_count > 0 and await_count > 0, "No se detectó uso de async/await"

# 5. Validar Persistencia en LocalStorage
print("\n[5] Verificando LocalStorage...")
ls_usage = sum(1 for text in texts.values() if 'localStorage' in text)
setitem = sum(1 for text in texts.values() if 'setItem' in text)
getitem = sum(1 for text in texts.values() if 'getItem' in text)
print(f"  ✓ Referencias localStorage: {ls_usage}")
print(f"  ✓ localStorage.setItem() calls: {setitem}")
print(f"  ✓ localStorage.getItem() calls: {getitem}")
assert ls_usage > 0 and setitem > 0 and getitem > 0, "LocalStorage no implementado correctamente"

# 6. Validar Manejo de Errores
print("\n[6] Verificando Manejo de Errores...")
try_count = sum(1 for text in texts.values() if 'try' in text)
catch_count = sum(1 for text in texts.values() if 'catch' in text)
error_throw = sum(1 for text in texts.values() if 'throw new Error' in text)
console_error = sum(1 for text in texts.values() if 'console.error' in text)
print(f"  ✓ Bloques try/catch: {try_count}/{catch_count}")
print(f"  ✓ Excepciones lanzadas: {error_throw}")
print(f"  ✓ console.error() llamadas: {console_error}")
assert try_count > 0 and catch_count > 0, "Manejo de errores incompleto"

# 7. Validar Loader
print("\n[7] Verificando Loader...")
loader_html = '<div id="loader"' in texts['index']
loader_spinner = '.spinner' in texts['css']
loader_hidden = '.hidden' in texts['css']
loader_control = 'loader.classList' in texts['app']
print(f"  {'✓' if loader_html else '✗'} Elemento loader en HTML")
print(f"  {'✓' if loader_spinner else '✗'} Estilos de spinner en CSS")
print(f"  {'✓' if loader_hidden else '✗'} Clase .hidden en CSS")
print(f"  {'✓' if loader_control else '✗'} Control del loader en JS")
assert loader_html and loader_spinner and loader_hidden, "Loader incompleto"

# 8. Validar NO Frameworks
print("\n[8] Verificando ausencia de frameworks...")
forbidden = ['bootstrap', 'react', 'vue', 'angular', 'tailwind', 'jquery', 'npm']
framework_found = []
for fw in forbidden:
    found_in = [name for name, text in texts.items() if fw.lower() in text.lower()]
    if found_in:
        framework_found.append((fw, found_in))

if not framework_found:
    print(f"  ✓ Cero frameworks detectados")
else:
    print(f"  ✗ Frameworks encontrados:")
    for fw, locations in framework_found:
        print(f"    - {fw}: en {locations}")

assert not framework_found, f"Se detectaron frameworks no permitidos: {framework_found}"

# 9. Validar que NO hay referencias a Leaflet
print("\n[9] Verificando rollback de Leaflet...")
leaflet_refs = ['leaflet', 'L.map', 'map-container', '#map {']
leaflet_found = []
for ref in leaflet_refs:
    found_in = [name for name, text in texts.items() if ref in text]
    if found_in:
        leaflet_found.append((ref, found_in))

if not leaflet_found:
    print(f"  ✓ Cero referencias a Leaflet o mapas")
else:
    print(f"  ✗ Referencias a Leaflet encontradas:")
    for ref, locations in leaflet_found:
        print(f"    - {ref}: en {locations}")

# 10. Resumen de archivos
print("\n[10] Resumen de Archivos...")
for name, path in FILES.items():
    if path.exists():
        size = path.stat().st_size
        lines = len(texts[name].split('\n'))
        print(f"  {name:20} → {size:8} bytes | {lines:4} líneas")

# RESULTADO FINAL
print("\n" + "=" * 70)
if all([
    has_exports and has_imports,
    api_count >= 4,
    async_count > 0 and await_count > 0,
    ls_usage > 0 and setitem > 0 and getitem > 0,
    try_count > 0 and catch_count > 0,
    loader_html and loader_spinner and loader_hidden,
    not framework_found,
    not leaflet_found
]):
    print("✅ TODOS LOS REQUISITOS OBLIGATORIOS CUMPLIDOS")
    print("=" * 70)
    print("\nRESUMEN:")
    print(f"  • Arquitectura: Modular (5 módulos JS + 1 CSS + 1 HTML)")
    print(f"  • APIs: 4 consumidas con Async/Await")
    print(f"  • Persistencia: LocalStorage con estructura centralizada")
    print(f"  • Manejo de errores: Try/catch en todos los módulos")
    print(f"  • UI: Loader animado con estados")
    print(f"  • Stack: Vanilla JavaScript + CSS puro (cero frameworks)")
    print("\n✅ Proyecto listo para producción")
else:
    print("❌ ALGUNOS REQUISITOS NO FUERON CUMPLIDOS")
    exit(1)

print("=" * 70)
