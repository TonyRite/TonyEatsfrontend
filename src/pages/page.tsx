import { useSearchRestaurants } from "@/Api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import SortOptionsDropdown from "@/components/sortOptionsDropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type SearchState = {
   SearchQuery:string;
   page:number;
   selectedCuisines:string[];
   sortOption:string;
}
const SearchPage = () => {
   const {city } = useParams();
   const [SearchState,setSearchState] = useState<SearchState>({
      SearchQuery:"",
      page:1,
      selectedCuisines:[],
      sortOption:"bestMatch",
   });

   const [isExpanded,setIsExpanded] = useState<boolean>(false);

   const {results,isLoading} = useSearchRestaurants(SearchState,city);

   const setSortOption = (sortOption:string)=>{
      setSearchState((prevState)=>({
         ...prevState,
         sortOption,
      }))
   }
   const setSelectedCuisines = (selectedCuisines:string[])=>{
      setSearchState((prevState)=>({
         ...prevState,
         selectedCuisines,
         page:1,
   }))
   };
   const setPage = (page:number)=>{
      setSearchState((prevState)=>({
         ...prevState,
         page,
      }));
   }

   const setSearchQuery = (searchFormData:SearchForm) =>{
      setSearchState((prevState)=>({
         ...prevState,
         SearchQuery: searchFormData.searchQuery,
         page:1,
      }))
   }

   const resetSearch = ()=>{
      setSearchState((prevState)=>({
         ...prevState,
         SearchQuery: "",
         page:1,     
      }))
   }

   if(isLoading){
      return <span>Loading...</span>;
   }
   if(!results?.data || !city){
      return <span>No results found</span>;
   }
   
   return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cuisines-list">
         <CuisineFilter 
         selectedCuisines={SearchState.selectedCuisines}
         onChange={setSelectedCuisines}
         isExpanded={isExpanded}
         onExpandedClick={()=>setIsExpanded((prevISExpanded)=>!prevISExpanded)}/>
      </div>
      <div id="main-content" className="flex flex-col gap-5">
         <SearchBar 
         searchQuery ={SearchState.SearchQuery}
         onSubmit={setSearchQuery} 
         placeHolder="Search by Cuisine or restaurant name" 
         onReset={resetSearch}/>

         <div className="flex justify-between flex-col gap-3 lg:flex-row">
         <SearchResultInfo total={results.pagination.total} city={city}/>
         <SortOptionsDropdown 
         sortOption={SearchState.sortOption} 
         onChange={(value)=> setSortOption(value)} />
         </div>
         {results.data.map((restaurant)=>(
            <SearchResultCard restaurant={restaurant}/>
         ))
         }
         <PaginationSelector 
         page={results.pagination.page} 
         pages={results.pagination.pages}
         onPageChange={setPage}
         />
      </div>
    </div>
   )
}

export default SearchPage;

