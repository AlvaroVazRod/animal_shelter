package com.login.service.impl;

import com.login.dto.TagDto;
import com.login.mapper.TagMapper;
import com.login.model.Tag;
import com.login.repository.AnimalRepository;
import com.login.repository.TagRepository;
import com.login.service.ImageService;
import com.login.service.TagService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final AnimalRepository animalRepository;
    private final ImageService imageService;

    public TagServiceImpl(TagRepository tagRepository, AnimalRepository animalRepository, ImageService imageService) {
        this.tagRepository = tagRepository;
        this.animalRepository = animalRepository;
        this.imageService = imageService;
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
    public TagDto createTag(TagDto tagDto, MultipartFile iconFile) throws IOException {
        Tag tag = TagMapper.toEntity(tagDto);
        tag = tagRepository.save(tag);

        if (iconFile != null && !iconFile.isEmpty()) {
            imageService.uploadTagIcon(tag.getId(), iconFile);
            tag = tagRepository.findById(tag.getId()).orElseThrow();
        }

        return TagMapper.toDto(tag);
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
    public TagDto updateTag(Long id, TagDto tagDto, MultipartFile iconFile) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etiqueta no encontrada"));

        tag.setName(tagDto.getName());
        tag.setDescription(tagDto.getDescription());
        tag.setColor(tagDto.getColor());
        tag = tagRepository.save(tag);

        if (iconFile != null && !iconFile.isEmpty()) {
            imageService.uploadTagIcon(tag.getId(), iconFile);
            tag = tagRepository.findById(tag.getId()).orElseThrow();
        }

        return TagMapper.toDto(tag);
    }
}

