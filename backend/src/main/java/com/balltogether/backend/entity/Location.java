/** Clasa pentru Location
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
 */
package com.balltogether.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "locations")
@Data
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long id;
    
    private String name;
    private String address;
    
    @Column(name = "price_per_hour")
    private Double price; 
    
    @Column(name = "capacity")
    private Integer players;

    private Double latitude;
    private Double longitude;
    
    @Column(name = "image_url")
    private String imageUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "location_sports",
        joinColumns = @JoinColumn(name = "location_id"),
        inverseJoinColumns = @JoinColumn(name = "sport_id")
    )
    private Set<Sport> sports = new HashSet<>();
}