
package com.login.service.impl;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.UUID;
import com.login.dto.TagDto;	
import com.login.model.Tag;
import com.login.mapper.TagMapper;
import com.login.repository.AnimalRepository;
import com.login.repository.TagRepository;
import com.login.service.TagService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    public TagDto createTag(TagDto tagDto, MultipartFile iconFile) throws IOException {
        Tag tag = TagMapper.toEntity(tagDto);

        if (iconFile != null && !iconFile.isEmpty()) {
            String filename = saveIconFile(iconFile);
            tag.setIcon(filename);
        }

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
    public TagDto updateTag(Long id, TagDto tagDto, MultipartFile iconFile) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etiqueta no encontrada"));

        tag.setName(tagDto.getName());
        tag.setDescription(tagDto.getDescription());
        tag.setColor(tagDto.getColor());

        if (iconFile != null && !iconFile.isEmpty()) {
            if (tag.getIcon() != null) {
                Path oldPath = Paths.get("uploads/tags").resolve(tag.getIcon());
                try {
                    Files.deleteIfExists(oldPath);
                } catch (IOException e) {
                    throw new RuntimeException("Error al eliminar el icono anterior", e);
                }
            }

            String filename = saveIconFile(iconFile);
            tag.setIcon(filename);
        }

        Tag updated = tagRepository.save(tag);
        return TagMapper.toDto(updated);
    }

    private String saveIconFile(MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path directory = Paths.get("uploads/tags");
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }
            Path filePath = directory.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el icono", e);
        }
    }


}
