
package com.login.repository;

import com.login.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
	
    @Query(value = "SELECT t.* FROM tags t " +
                   "JOIN animals_tags at ON t.id = at.id_tag " +
                   "WHERE at.id_animal = :animalId", nativeQuery = true)
    List<Tag> findTagsByAnimalId(@Param("animalId") Long animalId);

	@Modifying
    @Query(value = "INSERT INTO animals_tags (id_animal, id_tag) VALUES (:animalId, :tagId)", nativeQuery = true)
    void insertAnimalTagRelation(@Param("animalId") Long animalId, @Param("tagId") Long tagId);

	@Modifying
    @Query(value = "DELETE FROM animals_tags WHERE id_animal = :animalId AND id_tag = :tagId", nativeQuery = true)
    void deleteAnimalTagRelation(@Param("animalId") Long animalId, @Param("tagId") Long tagId);
    
    
}
