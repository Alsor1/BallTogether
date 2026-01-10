/** Clasa pentru RefereeDTO
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
 */
package com.balltogether.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class RefereeDTO {
    private Long id;
    private String name;
    private List<String> sports;
    private String bio;
    private BigDecimal price;
    private String imageUrl;

    public RefereeDTO(Long id, String name, List<String> sports, String bio, BigDecimal price, String imageUrl) {
        this.id = id;
        this.name = name;
        this.sports = sports;
        this.bio = bio;
        this.price = price;
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            this.imageUrl = imageUrl;
        } else {
            this.imageUrl = "https://ui-avatars.com/api/?name=" + name.replace(" ", "+") + "&background=random&size=256";
        }
    }
}