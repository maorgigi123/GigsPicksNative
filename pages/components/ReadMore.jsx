import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const ContentContainer = React.forwardRef(({ children, style }, ref) => (
  <View ref={ref} style={[styles.contentContainer, style]}>
    {children}
  </View>
));

const ReadMore = ({ text, maxRows = 5, maxCharacters = 100, showReadMore = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      // Uncomment if you want to use this height somewhere
      // setContentHeight(contentHeight);
    }
  }, [text]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  // Split text by new lines and calculate actual rows
  const lines = text.split('\n');
  const actualRows = lines.length;
  let displayedText = text;
  const lineHeight = 16; // Adjust as needed
  if (!isExpanded && text.length > maxCharacters) {
    displayedText = text.slice(0, maxCharacters) + '...';
  }

  return (
    <View>
      <ContentContainer ref={contentRef}>
        <TouchableOpacity onPress={toggleReadMore}>
          <Text
            style={{ maxHeight: isExpanded ? 'none' : maxRows * lineHeight, color: 'white' }}
          >
            {displayedText}
          </Text>
        </TouchableOpacity>
      </ContentContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
    lineHeight: 1.6,
    wordBreak: 'break-all',
  },
  contentText: {
    color: 'white',
  },
});

export default ReadMore;
