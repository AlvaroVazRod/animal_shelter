
package com.login.service.impl;

import com.login.dto.TagDto;
import com.login.model.Tag;
import com.login.mapper.TagMapper;
import com.login.repository.AnimalRepository;
import com.login.repository.TagRepository;
import com.login.service.TagService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final AnimalRepository animalRepository;

    public TagServiceImpl(TagRepository tagRepository, AnimalRepository animalRepository) {
        this.tagRepository = tagRepository;
        this.animalRepository = animalRepository;
    }

    @Override
    public List<TagDto> getAllTags() {
        return tagRepository.findAll().stream()
                .map(TagMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TagDto getTagById(Long id) {
        Tag tag = tagRepository.findById(id).orElseThrow();
        return TagMapper.toDto(tag);
    }

    @Override
    public TagDto createTag(TagDto tagDto) {
        Tag tag = TagMapper.toEntity(tagDto);
        return TagMapper.toDto(tagRepository.save(tag));
    }

    @Override
    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }

    @Override
    public List<TagDto> getTagsByAnimalId(Long animalId) {
        return tagRepository.findTagsByAnimalId(animalId).stream()
                .map(TagMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void addTagToAnimal(Long animalId, Long tagId) {
        tagRepository.insertAnimalTagRelation(animalId, tagId);
    }

    @Override
    public void removeTagFromAnimal(Long animalId, Long tagId) {
        tagRepository.deleteAnimalTagRelation(animalId, tagId);
    }
    @Override
    public TagDto updateTag(Long id, TagDto tagDto) {
        Tag existingTag = tagRepository.findById(id).orElseThrow(() -> new RuntimeException("Tag no encontrada"));

        existingTag.setName(tagDto.getName());
        existingTag.setDescription(tagDto.getDescription());
        existingTag.setColor(tagDto.getColor());
        existingTag.setIcon(tagDto.getIcon());

        return TagMapper.toDto(tagRepository.save(existingTag));
    }
}
