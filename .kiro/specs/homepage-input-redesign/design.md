# Design Document

## Overview

This design document outlines the visual and technical specifications for redesigning the ChatPrompt component to match the provided reference design. The redesign focuses on achieving pixel-perfect accuracy while maintaining all existing functionality and ensuring responsive behavior across different screen sizes.

## Architecture

The redesign will modify the existing ChatPrompt component structure while preserving its React component architecture and prop interface. The component will maintain its current API but with updated styling and visual presentation.

### Component Structure
- **Container**: Main wrapper with updated styling
- **Input Field**: Textarea with refined visual appearance
- **Action Buttons**: Attachment and send buttons with updated positioning and styling
- **Responsive Layout**: Maintained compatibility with existing responsive behavior

## Components and Interfaces

### ChatPrompt Component Updates

**Visual Specifications Based on Reference Design:**

1. **Container Styling**
   - Background: Dark semi-transparent background (`bg-gray-800/90`)
   - Border: Clear white border (`border-white`) for maximum visibility
   - Border Radius: Fully rounded (`rounded-full`)
   - Backdrop Blur: Maintained for glass effect
   - Padding: Adjusted for optimal visual balance

2. **Input Field Styling**
   - Placeholder Text: "What can I do for you?" with high visibility
   - Text Color: White (`text-white`) for maximum contrast
   - Placeholder Color: Light gray (`text-gray-300`) for clear visibility
   - Font Size: 16px for optimal readability
   - Background: Transparent to show container background
   - Padding: Optimized for comfortable typing experience

3. **Action Buttons Layout**
   - **Attachment Button**: 
     - Position: Left side of action area
     - Icon: Paperclip icon
     - Background: Subtle dark background
     - Hover State: Slightly lighter background
   - **Send Button**:
     - Position: Right side of action area
     - Icon: Arrow up icon
     - Background: Gradient or solid color when enabled
     - Disabled State: Muted appearance when input is empty

4. **Spacing and Layout**
   - Internal padding adjusted to match reference proportions
   - Button spacing optimized for visual balance
   - Overall height matching reference design
   - Responsive behavior maintained

### Color Scheme Analysis

Updated for maximum visibility:
- **Primary Background**: Dark gray with transparency (bg-gray-800/90)
- **Border Color**: Clear white border (border-white) for high visibility
- **Text Color**: Light gray/white for contrast
- **Placeholder Text**: Light gray (text-gray-300) for visibility
- **Button Backgrounds**: Dark with subtle highlights
- **Send Button Active**: Accent color (blue/purple gradient)

## Data Models

No data model changes required. The component will maintain its existing prop interface:

```typescript
interface ChatPromptProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSend?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}
```

## Error Handling

The component will maintain existing error handling patterns:
- Input validation for empty states
- Disabled state management
- Keyboard event handling
- Auto-resize functionality preservation

## Testing Strategy

### Visual Testing
- Compare rendered component against reference design
- Verify responsive behavior across screen sizes
- Test hover and focus states
- Validate color accuracy and spacing

### Functional Testing
- Ensure all existing functionality remains intact
- Test keyboard interactions (Enter key, etc.)
- Verify callback functions work correctly
- Test auto-resize behavior with multi-line input

### Integration Testing
- Verify component works correctly within Home component
- Test with different prop combinations
- Ensure styling doesn't conflict with parent components

## Implementation Approach

### Phase 1: Core Styling Updates
1. Update container background and border styling
2. Adjust padding and spacing to match reference
3. Refine input field appearance

### Phase 2: Button Styling
1. Update attachment button styling
2. Refine send button appearance and states
3. Adjust button positioning and spacing

### Phase 3: Fine-tuning
1. Perfect color matching with reference
2. Optimize responsive behavior
3. Test across different browsers and devices

## Technical Considerations

### CSS Classes Strategy
- Utilize existing Tailwind CSS utility classes
- Maintain consistency with current styling approach
- Use CSS custom properties for precise color matching if needed

### Responsive Design
- Ensure design works on mobile and desktop
- Maintain existing responsive breakpoints
- Preserve accessibility features

### Performance
- No performance impact expected
- Maintain existing component optimization
- Preserve auto-resize functionality efficiency