import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'
import { useNavigate } from 'react-router-dom'

import { FiPlus, FiSearch } from 'react-icons/fi'
import { Container, Brand, Menu, Search, Content, NewNote } from './styles.js'
import { Header } from '../../components/Header'
import { ButtonText } from '../../components/ButtonText'
import { Input } from '../../components/Input'
import { Section } from '../../components/Section'
import { Note } from '../../components/Note'

export function Home() {

  const [search, setSeatch] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [notes, setNotes] = useState([]);

  const navigate = useNavigate();

  function handleTagSelected(tagName) {
    if(tagName === "all") {
      return setTagsSelected([]);
    }

    const alreadySelected = tagsSelected.includes(tagName);
    
    if(alreadySelected) {
      const filteredTags = tagsSelected.filter(tag => tag !== tagName)
      setTagsSelected(filteredTags);

    }else{
      setTagsSelected(prevState => [...prevState,tagName]);
    }
  }

  function handleDetails(id) {
    navigate(`/details/${id}`)
  }

  
  useEffect(() => {
    async function fecthTags() {
      const response = await api.get("/tags")
      setTags(response.data)
    }

    fecthTags()
  },[]);

  useEffect(() => {
    async function fetchNotes() {
      const response = await api.get(`/notes?title=${search}&tags=${tagsSelected}`)
      setNotes(response.data);
    }

    fetchNotes();

  },[tagsSelected,search]);

  return (
    <Container>
      <Brand>
        <h1>Rocketnotes</h1>
      </Brand>

      <Header />

      <Menu>
      <li>
        <ButtonText 
        title="Todos"
        onClick={() => handleTagSelected("all")}  
        $isActive={tagsSelected.length === 0}
        />
      </li>
        {
        tags && tags.map(tag => (
          <li key={String(tag.id)}>
            <ButtonText 
            title={tag.name} 
            onClick={() => handleTagSelected(tag.name)}
            $isActive={tagsSelected.includes(tag.name)}
            />
            
          </li>
          ))
        }
      </Menu>

      <Search>
        <Input 
        placeholder="Pesquisar pelo título"
        onChange={(e) => setSeatch(e.target.value)}
        icon={FiSearch} 
        />
      </Search>

      <Content>

        <Section title="Minhas notas">
          {
          notes.map(note => (
          <Note 
          key={String(note.id)}
          data={note}
          onClick={() => handleDetails(note.id)}
          />
          ))
          }
          
        </Section>

      </Content>

      <NewNote to="/new" >
        <FiPlus />
        Criar Nota
      </NewNote>
    </Container>
  );
}