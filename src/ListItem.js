import { Draggable } from "react-beautiful-dnd";
import { LoremIpsum } from "lorem-ipsum";
import { generateFromString } from "generate-avatar";
import React, { useMemo } from "react";
import styled from "styled-components";

const DragItem = styled.div`
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  background: var(--bg-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border: 1px solid var(--gray-200);
  cursor: grab;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
    border-color: var(--primary-300);
  }
  
  &:active {
    cursor: grabbing;
  }
  
  ${props => props.isDragging && `
    box-shadow: var(--shadow-xl);
    transform: rotate(2deg);
    border-color: var(--primary-400);
    background: var(--primary-50);
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, var(--primary-500), var(--secondary-500));
    border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  }
`;

const CardHeader = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.4;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardContent = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--gray-100);
`;

const TaskInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
`;

const TaskId = styled.span`
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 500;
  font-family: 'Monaco', 'Courier New', monospace;
  background: var(--gray-100);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  white-space: nowrap;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-shrink: 0;
`;

const Avatar = styled.img`
  height: 28px;
  width: 28px;
  border: 2px solid white;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base);
  
  ${DragItem}:hover & {
    transform: scale(1.1);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  font-weight: 500;
  background: ${props => {
    const colors = ['var(--primary-100)', 'var(--secondary-100)', 'var(--warning-100)'];
    return colors[props.index % colors.length];
  }};
  color: ${props => {
    const colors = ['var(--primary-700)', 'var(--secondary-700)', 'var(--warning-700)'];
    return colors[props.index % colors.length];
  }};
  white-space: nowrap;
`;

const PriorityIndicator = styled.div`
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: ${props => {
    const priorities = ['var(--danger-500)', 'var(--warning-500)', 'var(--secondary-500)'];
    return priorities[props.priority % 3];
  }};
  box-shadow: 0 0 0 3px ${props => {
    const priorities = ['var(--danger-100)', 'var(--warning-100)', 'var(--secondary-100)'];
    return priorities[props.priority % 3];
  }};
`;

const DragHandle = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity var(--transition-base);
  
  ${DragItem}:hover & {
    opacity: 0.3;
  }
  
  &::before,
  &::after {
    content: '';
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--gray-500);
  }
`;

const lorem = new LoremIpsum();

const ListItem = ({ item, index }) => {
  const randomHeader = useMemo(() => lorem.generateWords(5), []);
  const randomTags = useMemo(() => {
    const tagCount = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: tagCount }, () => lorem.generateWords(1));
  }, []);
  const priority = useMemo(() => Math.floor(Math.random() * 3), []);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <DragItem
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <PriorityIndicator priority={priority} />
            <DragHandle>
              <div style={{width: '12px', height: '2px', background: 'var(--gray-400)', borderRadius: '2px'}} />
              <div style={{width: '12px', height: '2px', background: 'var(--gray-400)', borderRadius: '2px'}} />
            </DragHandle>
            
            <CardHeader>{randomHeader}</CardHeader>
            
            <TagsContainer>
              {randomTags.map((tag, idx) => (
                <Tag key={idx} index={idx}>{tag}</Tag>
              ))}
            </TagsContainer>
            
            <CardContent>Task management and organization</CardContent>
            
            <CardFooter>
              <TaskInfo>
                <TaskId>{item.content}</TaskId>
              </TaskInfo>
              <Author>
                <Avatar
                  src={`data:image/svg+xml;utf8,${generateFromString(item.id)}`}
                  alt="Avatar"
                />
              </Author>
            </CardFooter>
          </DragItem>
        );
      }}
    </Draggable>
  );
};

export default ListItem;

