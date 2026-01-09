package com.balltogether.backend.controller;

import com.balltogether.backend.entity.Location;
import com.balltogether.backend.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "http://localhost:3000")
public class LocationController {

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping
    public List<Location> getLocations() {
        return locationRepository.findAllLocationsNative();
    }

    // Aceasta este metoda care îți lipsea sau nu mergea
    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        // Verifică consola serverului Java când accesezi pagina. 
        // Dacă nu apare nimic, cererea e blocată de Security înainte să ajungă aici.
        System.out.println("Fetching location with ID: " + id); 
        
        return locationRepository.findByIdNative(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}