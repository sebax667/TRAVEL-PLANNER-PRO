#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TEST DETALLADO: Verificación de Requerimientos Específicos
Travel Planner Pro - Proyecto Final
"""

import os
import re
from pathlib import Path

ROOT = Path(__file__).parent
FILES = {
    'index.html': ROOT / 'index.html',
    'app.js': ROOT / 'js' / 'app.js',
    'countries.js': ROOT / 'js' / 'countries.js',
    'weather.js': ROOT / 'js' / 'weather.js',
    'currency.js': ROOT / 'js' / 'currency.js',
    'tourism.js': ROOT / 'js' / 'tourism.js',
    'storage.js': ROOT / 'js' / 'storage.js',
    'styles.css': ROOT / 'css' / 'styles.css',
}

print("=" * 80)
print("TEST DETALLADO: VERIFICACIÓN DE REQUERIMIENTOS ESPECÍFICOS")
print("=" * 80)

# Leer todos los archivos
texts = {}
for name, path in FILES.items():
    if path.exists():
        texts[name] = path.read_text(encoding='utf-8')
    else:
        print(f"❌ ARCHIVO NO ENCONTRADO: {name}")
        exit(1)

# ============================================================================
# REQUERIMIENTO 1: CERO FRAMEWORKS
# ============================================================================
print("\n" + "=" * 80)
print("REQUERIMIENTO 1: CERO FRAMEWORKS (React, Vue, Angular, Tailwind, Bootstrap)")
print("=" * 80)

forbidden_frameworks = {
    'React': ['import React', 'from "react"', "from 'react'", '<React', 'ReactDOM'],
    'Vue': ['import Vue', 'from "vue"', "from 'vue'", '<template', 'v-if', 'v-for'],
    'Angular': ['import { Component }', '@angular/', 'NgModule', 'decorators'],
    'Bootstrap': ['bootstrap.css', 'class="col-', 'class="row"', 'class="container"'],
    'Tailwind': ['tailwind', '@apply', '@layer'],
    'jQuery': ['jQuery', '$.ajax', '$(', 'jquery'],
}

frameworks_found = []
for framework_name, patterns in forbidden_frameworks.items():
    for pattern in patterns:
        for file_name, content in texts.items():
            if pattern.lower() in content.lower():
                frameworks_found.append((framework_name, pattern, file_name))
                break

if not frameworks_found:
    print("✅ VERIFICADO: Cero frameworks encontrados")
    print("   - No hay importaciones de React")
    print("   - No hay directivas Vue")
    print("   - No hay decoradores Angular")
    print("   - No hay clases Bootstrap")
    print("   - No hay utilidades Tailwind")
    print("   - No hay jQuery")
else:
    print("❌ FRAMEWORKS DETECTADOS:")
    for fw, pattern, file in set([(f, p, fl) for f, p, fl in frameworks_found]):
        print(f"   - {fw}: '{pattern}' en {file}")

# ============================================================================
# REQUERIMIENTO 2: 4 APIs OBLIGATORIAS
# ============================================================================
print("\n" + "=" * 80)
print("REQUERIMIENTO 2: 4 APIs OBLIGATORIAS (Async/Await)")
print("=" * 80)

apis_required = {
    'REST Countries': {
        'file': 'countries.js',
        'urls': ['https://restcountries.com/v3.1/name/'],
        'functions': ['fetchCountryData'],
        'keywords': ['async', 'fetch', 'restcountries']
    },
    'Open-Meteo': {
        'file': 'weather.js',
        'urls': ['https://api.open-meteo.com/v1/forecast'],
        'functions': ['fetchWeatherData'],
        'keywords': ['async', 'fetch', 'open-meteo', 'temperature_2m']
    },
    'ExchangeRate-API': {
        'file': 'currency.js',
        'urls': ['https://api.exchangerate-api.com'],
        'functions': ['fetchCurrencyData'],
        'keywords': ['async', 'fetch', 'exchangerate-api', 'rates']
    },
    'Wikipedia': {
        'file': 'tourism.js',
        'urls': ['https://en.wikipedia.org', 'geosearch'],
        'functions': ['fetchTourismData'],
        'keywords': ['async', 'fetch', 'wikipedia']
    }
}

apis_verified = 0
for api_name, details in apis_required.items():
    file_name = details['file']
    if file_name not in texts:
        print(f"❌ {api_name}: Archivo {file_name} no encontrado")
        continue
    
    content = texts[file_name]
    
    # Verificar URLs
    urls_found = any(url in content for url in details['urls'])
    
    # Verificar funciones
    functions_found = any(func in content for func in details['functions'])
    
    # Verificar async/await
    has_async = 'async ' in content
    has_await = 'await ' in content
    has_fetch = 'fetch(' in content
    
    # Verificar keywords específicos
    keywords_found = any(kw in content.lower() for kw in details['keywords'])
    
    if urls_found and functions_found and has_async and has_await and has_fetch:
        apis_verified += 1
        print(f"✅ {api_name}")
        print(f"   - URL: {[u for u in details['urls'] if u in content][0] if urls_found else 'N/A'}")
        print(f"   - Función: {[f for f in details['functions'] if f in content][0] if functions_found else 'N/A'}")
        print(f"   - Async/Await: Sí")
        print(f"   - Fetch: Sí")
    else:
        print(f"❌ {api_name}")
        print(f"   - URL encontrada: {urls_found}")
        print(f"   - Función encontrada: {functions_found}")
        print(f"   - Async detectado: {has_async}")
        print(f"   - Await detectado: {has_await}")
        print(f"   - Fetch detectado: {has_fetch}")

print(f"\nAPIs verificadas: {apis_verified}/4")

# ============================================================================
# REQUERIMIENTO 3: MÓDULOS Y LOCALSTORAGE
# ============================================================================
print("\n" + "=" * 80)
print("REQUERIMIENTO 3: MÓDULOS Y LOCALSTORAGE")
print("=" * 80)

storage_content = texts['storage.js']

# Verificar módulos
modules_to_check = {
    'Módulo 1 (Registro de Viajero)': ['saveUser', 'getUser'],
    'Módulo 7 (Favoritos - Países)': ['toggleFavoriteCountry', 'isCountryFavorite'],
    'Módulo 8 (Favoritos - Atracciones)': ['toggleFavoriteAttraction', 'isAttractionFavorite'],
    'Módulo 9 (Historial)': ['addToHistory'],
    'Módulo 10 (Tema)': ['toggleThemeStorage', 'getTheme'],
    'Módulo 11 (Estadísticas)': ['getDashboardStats'],
}

# Verificar localStorage
ls_checks = {
    'localStorage.getItem': 'localStorage.getItem' in storage_content,
    'localStorage.setItem': 'localStorage.setItem' in storage_content,
    'JSON.parse': 'JSON.parse' in storage_content,
    'JSON.stringify': 'JSON.stringify' in storage_content,
}

print("Módulos implementados en storage.js:")
modules_verified = 0
for module_name, functions in modules_to_check.items():
    found = all(func in storage_content for func in functions)
    if found:
        modules_verified += 1
        print(f"✅ {module_name}")
        print(f"   Funciones: {', '.join(functions)}")
    else:
        missing = [f for f in functions if f not in storage_content]
        print(f"❌ {module_name}")
        print(f"   Funciones faltantes: {', '.join(missing)}")

print(f"\nMódulos verificados: {modules_verified}/{len(modules_to_check)}")

print("\nLocalStorage implementado:")
ls_verified = 0
for check_name, result in ls_checks.items():
    if result:
        ls_verified += 1
        print(f"✅ {check_name}")
    else:
        print(f"❌ {check_name}")

print(f"\nLocalStorage verificado: {ls_verified}/{len(ls_checks)}")

# ============================================================================
# VERIFICACIÓN DE VANILLA JS
# ============================================================================
print("\n" + "=" * 80)
print("VERIFICACIÓN ADICIONAL: VANILLA JS (Sin librerías externas)")
print("=" * 80)

vanilla_checks = {
    'document.getElementById': 'document.getElementById' in texts['app.js'],
    'document.addEventListener': 'document.addEventListener' in texts['app.js'],
    '.innerHTML': '.innerHTML' in texts['app.js'],
    '.classList': '.classList' in texts['app.js'],
    'fetch API': 'fetch(' in ' '.join(texts.values()),
    'Promise.allSettled': 'Promise.allSettled' in texts['app.js'],
}

vanilla_verified = 0
for check_name, result in vanilla_checks.items():
    if result:
        vanilla_verified += 1
        print(f"✅ {check_name}")
    else:
        print(f"❌ {check_name}")

print(f"\nVanilla JS verificado: {vanilla_verified}/{len(vanilla_checks)}")

# ============================================================================
# RESUMEN FINAL
# ============================================================================
print("\n" + "=" * 80)
print("RESUMEN FINAL")
print("=" * 80)

total_checks = len(frameworks_found) == 0
total_checks = total_checks and apis_verified == 4
total_checks = total_checks and modules_verified == len(modules_to_check)
total_checks = total_checks and ls_verified == len(ls_checks)
total_checks = total_checks and vanilla_verified == len(vanilla_checks)

print(f"\n1. Cero Frameworks: {'✅ 100%' if not frameworks_found else f'❌ {len(frameworks_found)} encontrados'}")
print(f"2. 4 APIs Obligatorias: {'✅ 100%' if apis_verified == 4 else f'❌ {apis_verified}/4'}")
print(f"3. Módulos en Storage: {'✅ 100%' if modules_verified == len(modules_to_check) else f'❌ {modules_verified}/{len(modules_to_check)}'}")
print(f"4. LocalStorage: {'✅ 100%' if ls_verified == len(ls_checks) else f'❌ {ls_verified}/{len(ls_checks)}'}")
print(f"5. Vanilla JS: {'✅ 100%' if vanilla_verified == len(vanilla_checks) else f'❌ {vanilla_verified}/{len(vanilla_checks)}'}")

print("\n" + "=" * 80)
if total_checks:
    print("✅✅✅ TODOS LOS REQUERIMIENTOS VERIFICADOS EXITOSAMENTE ✅✅✅")
else:
    print("❌ ALGUNOS REQUERIMIENTOS NO CUMPLEN")
print("=" * 80)
