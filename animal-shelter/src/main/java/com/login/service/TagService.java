
package com.login.service;

import com.login.dto.TagDto;
import java.util.List;

public interface TagService {
    List<TagDto> getAllTags();
    TagDto getTagById(Long id);
    TagDto createTag(TagDto tagDto);
    void deleteTag(Long id);
    List<TagDto> getTagsByAnimalId(Long animalId);
    void addTagToAnimal(Long animalId, Long tagId);
    void removeTagFromAnimal(Long animalId, Long tagId);
}
