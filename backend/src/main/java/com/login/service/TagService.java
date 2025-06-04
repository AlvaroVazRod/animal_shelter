
package com.login.service;

import com.login.dto.TagDto;

import java.io.IOException;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface TagService {
    List<TagDto> getAllTags();
    TagDto getTagById(Long id);
    TagDto createTag(TagDto tagDto, MultipartFile iconFile) throws IOException;
    void deleteTag(Long id);
    List<TagDto> getTagsByAnimalId(Long animalId);
    void addTagToAnimal(Long animalId, Long tagId);
    void removeTagFromAnimal(Long animalId, Long tagId);
    TagDto updateTag(Long id, TagDto tagDto, MultipartFile iconFile) throws IOException;
}
