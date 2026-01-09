/** Entity pentru Locatii/Terenuri
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
package com.balltogether.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "locations")
@Data
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id") // Potrivește cu diagrama
    private Long id;
    
    private String name;
    private String address;
    
    @Column(name = "price_per_hour") // Potrivește cu diagrama
    private Double price; 
    
    @Column(name = "capacity") // În diagramă este 'capacity', nu 'players'
    private Integer players;

    private Double latitude; // Schimbat din lat în latitude
    private Double longitude; // Schimbat din lng în longitude
    
    @Column(name = "image_url")
    private String imageUrl;
}