package com.example.services; 

import com.example.dtos.RecipeDTO;
import com.example.entities.Recipe;
import com.example.repositories.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; 
import java.util.List;
import java.util.stream.Collectors;

@Service 
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    private RecipeDTO convertToDTO(Recipe recipe) {
        RecipeDTO dto = new RecipeDTO();
        dto.setId(recipe.getId());
        dto.setTitle(recipe.getTitle());
        dto.setIngredients(recipe.getIngredients());
        dto.setInstructions(recipe.getInstructions());
        dto.setCookingTime(recipe.getCookingTime());
        dto.setDifficulty(recipe.getDifficulty());
        return dto;
    }

    public List<RecipeDTO> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Recipe saveRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }

    public List<RecipeDTO> getExpressRecipes() {
        return recipeRepository.findAll().stream()
                .filter(recipe -> recipe.getCookingTime() <= 30)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}