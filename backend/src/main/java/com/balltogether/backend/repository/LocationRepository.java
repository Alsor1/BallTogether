/** Repository pentru Locatii folosind SQL nativ
 * @author [Your Name]
 */
package com.balltogether.backend.repository;

import com.balltogether.backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    // Cerinta: Accesul la baza de date prin SQL manual
    @Query(value = "SELECT * FROM locations", nativeQuery = true)
    List<Location> findAllLocationsNative();
    
    @Query(value = "SELECT * FROM locations WHERE location_id = :id", nativeQuery = true)
    java.util.Optional<Location> findByIdNative(@Param("id") Long id);
}