package com.balltogether.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class RefereeDTO {
    private Long id;
    private String name;       // Vine din Users table
    private List<String> sports; // Lista de nume de sporturi
    private String bio;
    private BigDecimal price;
    private String imageUrl;   // Din DB sau generat automat

    public RefereeDTO(Long id, String name, List<String> sports, String bio, BigDecimal price, String imageUrl) {
        this.id = id;
        this.name = name;
        this.sports = sports;
        this.bio = bio;
        this.price = price;
        // Dacă nu are poză în DB, generăm un avatar automat bazat pe nume
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            this.imageUrl = imageUrl;
        } else {
            this.imageUrl = "https://ui-avatars.com/api/?name=" + name.replace(" ", "+") + "&background=random&size=256";
        }
    }
}