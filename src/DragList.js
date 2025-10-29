import React, { useEffect } from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableElement from "./DraggableElement";

const AppContainer = styled.div`
  min-height: 100vh;
  padding: var(--spacing-xl) var(--spacing-md);
  
  @media (min-width: 768px) {
    padding: var(--spacing-2xl) var(--spacing-xl);
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  animation: fadeIn 0.6s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: var(--spacing-sm);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.02em;
  
  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
`;

const DragDropContextContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-2xl);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInUp 0.6s ease-out;
  
  @media (min-width: 768px) {
    padding: var(--spacing-2xl);
  }
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-around;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
  border-radius: var(--radius-xl);
  border: 1px solid var(--gray-200);
`;

const StatCard = styled.div`
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-600);
  line-height: 1;
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// fake data generator
const getItems = (count, prefix) =>
  Array.from({ length: count }, (v, k) => k).map((k) => {
    const randomId = Math.floor(Math.random() * 1000);
    return {
      id: `item-${randomId}`,
      prefix,
      content: `item ${randomId}`
    };
  });

const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const lists = ["todo", "inProgress", "done"];

const generateLists = () =>
  lists.reduce(
    (acc, listKey) => ({ ...acc, [listKey]: getItems(10, listKey) }),
    {}
  );

function DragList() {
  const [elements, setElements] = React.useState(generateLists());

  useEffect(() => {
    setElements(generateLists());
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const listCopy = { ...elements };

    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    setElements(listCopy);
  };

  const totalTasks = Object.values(elements).reduce((acc, list) => acc + list.length, 0);

  return (
    <AppContainer>
      <Header>
        <Title>TaskFlow</Title>
        <Subtitle>Organize your tasks with beautiful drag and drop interface</Subtitle>
      </Header>
      
      <DragDropContextContainer>
        <StatsBar>
          <StatCard>
            <StatValue>{elements.todo?.length || 0}</StatValue>
            <StatLabel>To Do</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{elements.inProgress?.length || 0}</StatValue>
            <StatLabel>In Progress</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{elements.done?.length || 0}</StatValue>
            <StatLabel>Done</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{totalTasks}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatCard>
        </StatsBar>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <ListGrid>
            {lists.map((listKey) => (
              <DraggableElement
                elements={elements[listKey]}
                key={listKey}
                prefix={listKey}
              />
            ))}
          </ListGrid>
        </DragDropContext>
      </DragDropContextContainer>
    </AppContainer>
  );
}

export default DragList;

