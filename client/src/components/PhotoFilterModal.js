import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, RotateCcw, Check, Sparkles, Camera, Palette, Zap } from 'lucide-react';

const FilterModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const FilterModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #333;
`;

const FilterTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #ff69b4;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    transform: scale(1.1);
  }
`;

const FilterBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ImagePreview = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid #333;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: contain;
  border-radius: 10px;
  background: #222;
  margin-bottom: 20px;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ControlButton = styled.button`
  background: #333;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #444;
    transform: translateY(-2px);
  }

  &.active {
    background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  }
`;

const FilterOptions = styled.div`
  width: 300px;
  padding: 20px;
  overflow-y: auto;
  background: #1a1a1a;
`;

const FilterCategory = styled.div`
  margin-bottom: 25px;
`;

const CategoryTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #ff69b4;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const FilterButton = styled.button`
  background: #333;
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 15px 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;

  &:hover {
    background: #444;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  &.active {
    border-color: #ff69b4;
    background: linear-gradient(135deg, rgba(255, 105, 180, 0.2) 0%, rgba(122, 40, 138, 0.2) 100%);
  }
`;

const FilterIcon = styled.div`
  font-size: 1.5rem;
`;

const FilterName = styled.span`
  font-size: 0.8rem;
  text-align: center;
  font-weight: 500;
`;

const FilterFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-top: 1px solid #333;
`;

const ResetButton = styled.button`
  background: #333;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #444;
    transform: translateY(-2px);
  }
`;

const ApplyButton = styled.button`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 105, 180, 0.4);
  }
`;

const FilterSlider = styled.div`
  margin: 15px 0;
`;

const SliderLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 8px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #333;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ff69b4;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(255, 105, 180, 0.3);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ff69b4;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(255, 105, 180, 0.3);
  }
`;

const PhotoFilterModal = ({ isOpen, onClose, onApplyFilter, mediaUrl }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterOptions, setFilterOptions] = useState({});
  const [previewUrl, setPreviewUrl] = useState(mediaUrl);

  const filterCategories = {
    basic: {
      title: 'Basic',
      icon: <Camera size={18} />,
      filters: [
        { id: 'vintage', name: 'Vintage', icon: '📸' },
        { id: 'blackwhite', name: 'B&W', icon: '⚫' },
        { id: 'sepia', name: 'Sepia', icon: '🟤' },
        { id: 'blur', name: 'Blur', icon: '🌫️' },
        { id: 'brightness', name: 'Bright', icon: '☀️' },
        { id: 'contrast', name: 'Contrast', icon: '🎭' },
        { id: 'saturation', name: 'Saturate', icon: '🌈' },
        { id: 'hue', name: 'Hue', icon: '🎨' }
      ]
    },
    effects: {
      title: 'Effects',
      icon: <Sparkles size={18} />,
      filters: [
        { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
        { id: 'neon', name: 'Neon', icon: '⚡' },
        { id: 'pixelate', name: 'Pixelate', icon: '🔲' },
        { id: 'mirror', name: 'Mirror', icon: '🪞' },
        { id: 'fisheye', name: 'Fisheye', icon: '🐠' }
      ]
    },
    face_filters: {
      title: 'Face Filters',
      icon: <Palette size={18} />,
      filters: [
        { id: 'sunglasses', name: 'Sunglasses', icon: '🕶️' },
        { id: 'hat', name: 'Hat', icon: '🎩' },
        { id: 'mustache', name: 'Mustache', icon: '🥸' },
        { id: 'crown', name: 'Crown', icon: '👑' },
        { id: 'heart_eyes', name: 'Heart Eyes', icon: '😍' },
        { id: 'rainbow_vomit', name: 'Rainbow Vomit', icon: '🌈' }
      ]
    }
  };

  const handleFilterSelect = (filterId) => {
    setSelectedFilter(filterId);
    setFilterOptions({});
    
    // In a real implementation, you would apply the filter to the preview
    // For now, we'll just update the preview URL
    if (filterId) {
      setPreviewUrl(`${mediaUrl}?filter=${filterId}`);
    } else {
      setPreviewUrl(mediaUrl);
    }
  };

  const handleFilterOptionChange = (option, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleReset = () => {
    setSelectedFilter(null);
    setFilterOptions({});
    setPreviewUrl(mediaUrl);
  };

  const handleApply = () => {
    if (selectedFilter) {
      onApplyFilter(selectedFilter, filterOptions);
    }
  };

  const renderFilterOptions = () => {
    if (!selectedFilter) return null;

    const options = {
      vintage: [
        { key: 'intensity', label: 'Intensity', min: 0, max: 1, step: 0.1, default: 0.7 }
      ],
      blackwhite: [
        { key: 'brightness', label: 'Brightness', min: 0.5, max: 1.5, step: 0.1, default: 1.0 },
        { key: 'contrast', label: 'Contrast', min: 0.5, max: 2.0, step: 0.1, default: 1.2 }
      ],
      sepia: [
        { key: 'intensity', label: 'Intensity', min: 0, max: 1, step: 0.1, default: 0.8 }
      ],
      blur: [
        { key: 'sigma', label: 'Blur Amount', min: 0.5, max: 5, step: 0.5, default: 2 }
      ],
      brightness: [
        { key: 'brightness', label: 'Brightness', min: 0.5, max: 2.0, step: 0.1, default: 1.2 }
      ],
      contrast: [
        { key: 'contrast', label: 'Contrast', min: 0.5, max: 2.0, step: 0.1, default: 1.3 }
      ],
      saturation: [
        { key: 'saturation', label: 'Saturation', min: 0, max: 2.0, step: 0.1, default: 1.5 }
      ],
      hue: [
        { key: 'hue', label: 'Hue Shift', min: -180, max: 180, step: 10, default: 30 }
      ],
      rainbow: [
        { key: 'intensity', label: 'Intensity', min: 0, max: 1, step: 0.1, default: 0.6 }
      ],
      neon: [
        { key: 'intensity', label: 'Intensity', min: 0, max: 1, step: 0.1, default: 0.8 }
      ],
      pixelate: [
        { key: 'pixelSize', label: 'Pixel Size', min: 2, max: 20, step: 1, default: 8 }
      ],
      fisheye: [
        { key: 'strength', label: 'Strength', min: 0, max: 1, step: 0.1, default: 0.5 }
      ]
    };

    const filterOptions = options[selectedFilter] || [];
    
    return (
      <div>
        <h4 style={{ color: '#ff69b4', marginBottom: '15px' }}>Filter Options</h4>
        {filterOptions.map(option => (
          <FilterSlider key={option.key}>
            <SliderLabel>{option.label}</SliderLabel>
            <Slider
              type="range"
              min={option.min}
              max={option.max}
              step={option.step}
              value={filterOptions[option.key] || option.default}
              onChange={(e) => handleFilterOptionChange(option.key, parseFloat(e.target.value))}
            />
          </FilterSlider>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <FilterModalOverlay>
      <FilterModalContent>
        <FilterHeader>
          <FilterTitle>
            <Zap size={24} />
            Photo Filters
          </FilterTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </FilterHeader>

        <FilterBody>
          <ImagePreview>
            <PreviewImage src={previewUrl} alt="Filter Preview" />
            <FilterControls>
              <ControlButton onClick={handleReset}>
                <RotateCcw size={18} />
                Reset
              </ControlButton>
            </FilterControls>
          </ImagePreview>

          <FilterOptions>
            {Object.entries(filterCategories).map(([categoryId, category]) => (
              <FilterCategory key={categoryId}>
                <CategoryTitle>
                  {category.icon}
                  {category.title}
                </CategoryTitle>
                <FilterGrid>
                  {category.filters.map(filter => (
                    <FilterButton
                      key={filter.id}
                      className={selectedFilter === filter.id ? 'active' : ''}
                      onClick={() => handleFilterSelect(filter.id)}
                    >
                      <FilterIcon>{filter.icon}</FilterIcon>
                      <FilterName>{filter.name}</FilterName>
                    </FilterButton>
                  ))}
                </FilterGrid>
              </FilterCategory>
            ))}
            
            {renderFilterOptions()}
          </FilterOptions>
        </FilterBody>

        <FilterFooter>
          <ResetButton onClick={handleReset}>
            <RotateCcw size={18} />
            Reset
          </ResetButton>
          <ApplyButton onClick={handleApply} disabled={!selectedFilter}>
            <Check size={18} />
            Apply Filter
          </ApplyButton>
        </FilterFooter>
      </FilterModalContent>
    </FilterModalOverlay>
  );
};

export default PhotoFilterModal;
