package com.balltogether.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long id;

    private String name;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(name = "price_per_hour")
    private BigDecimal pricePerHour;

    private Integer capacity;
}