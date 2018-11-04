
function storeInfo(d) {
    return d;
};

let recipeTobeEdited;

$('#burger').click(function(){
    if($('.nav-items').css('display') === 'none'){
        $('.nav-items').css('display','block');
    } else {
        $('.nav-items').css('display','none');
    }
});

// make it so menu items display on large screens if menu has been closed on small screen
$( window ).resize(function() {
  if($(window).width() > 767) {
       $('header').css('display', 'grid');
	   $('.nav-items').css('display','block');
  } else {
      $('.nav-items').css('display','none');
  }
});

// show and hide users recipes / collected/ create recipe
$('.inner-menu-c').click(function(){
    $('.grids').css('display', 'none');
    $(this).addClass('active-c');
    $('.all-collected').css('display', 'none');
    $('form.user-page').css('display', 'block');
    $('.inner-menu-a').removeClass('active-a');
    $('.inner-menu-b').removeClass('active-b');
    $('.inner-menu-c').removeClass('active-a');
    
});

$('.inner-menu-a').click(function(){
    $('.grids').css('display', 'grid');
    $('.all-collected').css('display', 'none');
    $('form.user-page').css('display', 'none');
    $('.user-inner-menu ul li').css('display', 'inline');
    $('.inner-menu-d').css('display', 'none');
    $('.edit-page').css('display', 'none');
    $('.inner-menu-a').addClass('active-a');
    $('.inner-menu-c').removeClass('active-c');
    $('.inner-menu-b').removeClass('active-b');
});

$('.inner-menu-b').click(function(){
    let allCollected = $('.all-collected');
    console.log(allCollected[0].childNodes.length);
    console.log(allCollected[0].childNodes);
    //$('.all-collected').empty();
    getCollectedRecipes();
    $('.inner-menu-c').removeClass('active-c');
    $('.inner-menu-b').addClass('active-b');
    $('.inner-menu-a').removeClass('active-a');
    $('.grids').css('display', 'none');
    $('.all-collected').css('display', 'grid');
    $('form.user-page').css('display', 'none');
});

$('.edit-recipe').click(function(){
    $('.user-inner-menu ul li').css('display', 'none');
    $('.inner-menu-a').css('display', 'inline');
    $('.inner-menu-d').css('display', 'inline');
    $('.inner-menu-a').removeClass('active-a');
    $('.inner-menu-d').addClass('active-c');
    $('.grids').css('display', 'none');
    $('.edit-page').css('display', 'block');

    let recipe_name = $(this).attr('id');
     let url = '/edit_recipe/'+ recipe_name;
     $.ajax({
        type : 'GET',
        url : url,
        success: function(data){
           console.log(data);
           fillInEditRecipeDetails(data);
           recipeTobeEdited = storeInfo(data);
        }
      });
});

$('.new-category').keydown(function(){
    $('select').val('nul');
});

$('select').change(function(){
    $('.new-category').val('');
});

function fillInEditRecipeDetails(data) {
    $('.edit-rem').remove();
    $('.create-step').remove();
    $('.create input').val('');
    $('.edit-div').html('');
    $('input[type=checkbox]').prop('checked', false);
    
    let d = data[0][0];
    ({Celery, Cerals, Crust, Egg, Fish, Lupin, Milk, Moll, Mustard, Nuts, Pnuts, SBeans, SDioxide, SSeeds} = d)
    //let allA = [Celery, Cerals, Crust, Egg, Fish, Lupin, Milk, Moll, Mustard, Nuts, Pnuts, SBeans, SDioxide, SSeeds];
    
    let recipeName = d.recipe_name;
    let authorName = d.author_name;
    let prep = d.prep;
    let cook = d.cook;
    let serves = d.serves;
    let instructions = d.instructions;
    
    // show category that had been used
    $(".edit-category option[value='"+d.category_name+"']").attr('selected',"selected");
    
    
   // set checked any allergens that had been checked
    $('input[type=checkbox]:visible').each(function(){
        let name = $(this).attr('class');
        if(d[name] === 'T') {
            $("."+ name).prop('checked', true);
        }
    });
    
    // fill values into text inputs
    $('.recipe-inp-edit').val(recipeName);
    $('.author-inp-edit').val(authorName);
    $('.prep-inp-edit').val(prep);
    $('.serves-inp-edit').val(serves);
    $('.cook-inp-edit').val(cook);
    
    // Add the Ingredients and Quantities
    let ing = data[1];
    
    // destructure array
    let first, rest;
    [first, ...rest] = ing;
    
    // First ingredient and  quantity with the headers
    let start = `<ul class='create-recipe type-b edit-b ing-edit'><li><label>INGREDIENTS</label><input type='text' value="`+first.ing_name+`"></li></div>
                 <li><label>QUANTITY</label><input type='text' value="`+first.ing_quantity+`"></li></ul>`;
                 
     $('.edit-div').append(start);
     
    // rest of ingredients and quanties
    for(let item in rest) {
        let holder = `<div class="edit-rem">
                          <li class="other-li">
                            <input type='text' value="`+rest[item].ing_name+`">
                          </li>
                          <li class="special-li">
                            <input type='text' value="`+rest[item].ing_quantity+`">
                            
                          </li>
                      </div>`;
                      
                      
        $('.edit-b').append(holder);
    }
    
    // Add the Instructions 
    instructions = instructions.split('_');
    
    for(let item in instructions) {
        let instruct = `<textarea rows="3" class='create-step step-edit' placeholder='Pour into bowl' >`+instructions[item]+`</textarea>`;
        $('.instructions-con-create').append(instruct);
    }
    
    
}

function getCollectedRecipes() {
    
    let url = '/collect';
      $.ajax({
        type : 'GET',
        url : url,
        success: function(data){
           console.log(data);
           if (data.length > 0) recipeTemplate(data);
           
           let allCollected = $('.all-collected');
           console.log(allCollected[0].childNodes.length);
           
        }
      });
}


// Used to add extra lines of ingredients and quanties
$('.adding-lines-edit').click(function(){
  addOptions('-edit');
});

$('.adding-lines').click(function(){
  addOptions();
});

function addOptions(opt='') {

		var option = `<div class="edit-rem">
                          <li class="other-li">
                            <input type="text" >
                          </li>
                          <li class="special-li">
                            <input type="text">
                            <span class="remove-ing">X</span>
                          </li>
                      </div>`;
   $('.ing'+opt).append(option);
}


$(function(){
    $('.create').on('click', 'span.remove-ing', function(){
       var rem = $(this).closest('div');
    $(rem).remove();
       });
}); 
/*
$(function(){
    $('.ing').on('click', 'span.remove-ing', function(){
       var rem = $(this).closest('li');
    $(rem).remove();
    $('.ing li:last').remove();
       });
});  
*/
// for adding extra textarea for instructions in create recipe section

$('.add-textarea').click(function(){
    addTextarea();
});

function addTextarea() {
    var option = `<textarea rows="3" class='step' placeholder='Step 3 ' ></textarea>`;
    $('.instructions-con').append(option);
}

// A section for loading images by url and checking there width and height so as to limit the size of images user use for recipe image

function getSize() {
    $('.size').text('');
    $('.size').css('color','black');
    let hasSrc = $('.off-scr').attr('src');
    if(hasSrc) {
        let img_w = $('.off-scr')[0].clientWidth;
        let img_h = $('.off-scr')[0].clientHeight;
        let str = 'Width '+img_w+' Height '+img_h;
        //$('.pre').empty();
        
        if(((img_w < 701 || (img_w > 599 && img_w < 701)) && img_h >= 400 ) || ((img_h < 701 || (img_h > 599 && img_h < 701)) && img_w >= 400 ) ) {
             $('.size').text(str);
             return true;
        } else {
            $('.size').text(str);
            $('.size').css('color', 'red');
            $('.url').addClass('error');
            return false;
        }
    }
    return false;
    
   /* if (img_w > img_h && img_w > 500 ) {
        $('.size').text(str);
        $('.size').css('color', 'red');
    } else if (img_h > img_w) {
        $('.size').text(str);
        $('.size').css('color', 'red');
    } else if (img_h === img_w && img_w > 500) {
        $('.size').text(str);
        $('.size').css('color', 'red');
    } else {
        $('.size').text(str);
    }*/
}

$('.url-btn').click(function(e){
    e.preventDefault();
    
    $('.preview').empty();
    $('.pre').empty();
    let img_url = $('.url').val();
    
    if(img_url !== '') {
        createEl(img_url,getSize);
       
    } else {
        $('.size').text('');
         $('.size').css('color','black');
    }
});

function createEl(url, fn) {
    let el = '<img  class="img-url" src="'+url+'" alt="random food image">';
    let el_a = '<img class="off-scr" src="'+url+'" alt="random food image">';
   
    $('.preview').append(el);
    $('.pre').append(el_a);
  
  let waiting = setInterval(function() {
        let img_w = $('.off-scr')[0].clientWidth;
        let img_h = $('.off-scr')[0].clientHeight;
        if (img_w && img_h) {
            clearInterval(waiting);
            getSize();
        }
    }, 10);
  
}

$('.clear').click(function(e){
    e.preventDefault();
    
    $('.url').val('');
    $('.pre').empty();
    $('.preview').empty();
    $('.size').text('');
    $('.file-size').text('');
    $('.file-name').text('');
    $('.url').removeClass('error');
});

/*************************************************************************************************************/


// function combining a ingredient and a quantity into an arry to keep them in pairs
function pair_ing_quan(ing_quan){
  let ing_and_quan = [];
  let inner = [];
  let count = 0;
  let r_len = ing_quan.length; //$('.ing :input[type=text]').length;
  let b_count = 0;
  
  ing_quan.each(function(){
  
    count++;
    b_count++;
    if(count === 3 ) {
        ing_and_quan.push([...inner]);
        inner=[];
        count=1;
      }
    inner.push($(this).val());
       
    if (b_count === r_len && inner.length != 0) ing_and_quan.push(inner);
    
  });
  
  return ing_and_quan;
}

// check fields are filled in or else add error class
function isNotBlank(items) {
    let result = true;
    items.each(function(){
        if($(this).val() === '') {
            result = false;
            $(this).addClass('error');
        }
    });
    return result;
}


function check_validation() {
  let image = getSize();
  let ingAndQuan = isNotBlank($('.ing :input[type=text]'));
  let instructions = isNotBlank($('.step'));
  let author =  $('.author-inp').val();
  let recipeName = $('.recipe-inp').val();
  let category =  $( ".category-option option:selected" ).text();
  let newCategory = $('.new-category').val();
  let prep = $('.prep-inp').val();
  let cook = $('.cook-inp').val();
  let serves = $('.serves-inp').val();
  
  
  
  if(!author || !recipeName  || (!category && !newCategory)  || !prep  || !cook  || !serves || !ingAndQuan || !instructions || !image) {
    if(author === '') $('.author-inp').addClass('error');
    if(recipeName === '') $('.recipe-inp').addClass('error');
    if($( ".category-option option:selected" ).text() === '' && $('.new-category').val() === '') $( ".category-option" ).addClass('error');
    if(prep === '') $('.prep-inp').addClass('error');
    if(cook === '') $('.cook-inp').addClass('error');
    if(serves === '') $('.serves-inp').addClass('error');
    if(image === false) $('.url').addClass('error');
    $('html, body').animate({scrollTop: $("form").offset().top}, 500);
    
    setTimeout(function(){
       $( ".category-option" ).removeClass('error');
       $('input[type="text"]').removeClass('error');
       $('.step').removeClass('error');
       $('.url').removeClass('error');
    },2500);
    return false;
  } else {
    return true;
  }
}


function check_validation_edit() {
    
  let ingAndQuan = isNotBlank($('.ing-edit :input[type=text]'));
  let instructions = isNotBlank($('.step-edit'));
  let author =  $('.author-inp-edit').val();
  let recipeName = $('.recipe-inp-edit').val();
  let category =  $( ".category-option option:selected" ).text();
  let prep = $('.prep-inp-edit').val();
  let cook = $('.cook-inp-edit').val();
  let serves = $('.serves-inp-edit').val();
  
  
  
  if(!author || !recipeName  || !category  || !prep  || !cook  || !serves || ingAndQuan === false || instructions === false) {
    if(author === '') $('.author-inp-edit').addClass('error');
    if(recipeName === '') $('.recipe-inp-edit').addClass('error');
    if($( ".category-option option:selected" ).text() === '' && $('.new-category').val() === '') $( ".category-option" ).addClass('error');
    if(prep === '') $('.prep-inp-edit').addClass('error');
    if(cook === '') $('.cook-inp-edit').addClass('error');
    if(serves === '') $('.serves-inp-edit').addClass('error');
    $('html, body').animate({scrollTop: $("form").offset().top}, 500);
    
    setTimeout(function(){
       $( ".category-option" ).removeClass('error');
       $('input[type="text"]').removeClass('error');
       $('.step-edit').removeClass('error');
    },2500);
    return false;
  } else {
    return true;
  }
}

$('.edit-sub-btn').click(function(){
    event.preventDefault();
    let validated = check_validation_edit();
    
    if(validated) {
        console.log('recipeTobeEdited', recipeTobeEdited);
        let g_edit, ing_edit;
        [g_edit,ing_edit]=recipeTobeEdited;
        g_edit = g_edit[0];
        delete g_edit.likes;
        delete g_edit.collected;
        delete g_edit.url;
        
        console.log('general_edit', g_edit);
        console.log('ing_edit', ing_edit);
        //let ng_edit = {...g_edit};
        let keys = Object.keys(g_edit);
        //let k = [...keys];
        console.log(keys);
        
        
        let ing_and_quan = pair_ing_quan($('.ing-edit :input[type=text]'));
         // add instructions to an array
        let instructions = [];
        
        $('.step-edit').each(function() {
            instructions.push($(this).val());
        });
        instructions = instructions.join('_');
        
    
        let data = {};
        $('.create-edit input[type=checkbox]').each(function () {
            var cls =  $(this).attr('class');
            
            if ($(this).is(":checked")){
              data[cls]='T';
            } else {
              data[cls]='F';
            }
        });
          
        //let data = {};
        data.author_name = $('.author-inp-edit').val();
        data.recipe_name = $('.recipe-inp-edit').val();
        data.category_name = $( ".category-option option:selected" ).text();
        //data.allergens = allergens;
        data.instructions = instructions;
        data.ing_and_quan = ing_and_quan;
        data.prep = $('.prep-inp-edit').val();
        data.cook = $('.cook-inp-edit').val();
        data.serves = +$('.serves-inp-edit').val();
        data.username = $('.page-title').text();
        data.url ='/static/assets/images/dessert.jpg';
       
        let newData = getRequiredEdits(keys, data, g_edit);
        let ing = compareIngredientLists(ing_edit, data.ing_and_quan);
        
        //if(ing.length > 0) 
        if(!jQuery.isEmptyObject(ing)) newData.ing_and_quan = ing;
        newData.zrecipe_id =g_edit.recipe_id;
        console.log('before post',newData);
        
        if(!jQuery.isEmptyObject(newData)) {
            let url = '/edit_recipe/recipe';
              $.ajax({
                type : 'POST',
                url : url,
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                data : JSON.stringify(newData),
                success: function(data){
                   console.log(data);
                }
              });
        }
    }
});

// check for change in edit recipe execpt for ingredients which is checked by another function
function getRequiredEdits(k, d, db) {
    let newData = {};
    for(let key in k) {
        if(k[key] in d){
            if(db[k[key]] === d[k[key]]) {
                delete d[k[key]];
            } else {
                if( k[key] === 'author_name' || k[key] === 'category_name') {
                    newData[k[key]] = [d[k[key]]];
                } else {
                    newData[k[key]] = d[k[key]];
                }
            }
        }
    }
    
    return newData;
}

// used to compare whether ingredients seciton of recipe has been edited and changed
function compareIngredientLists(q, b) {
let arr = [];
let newArr= [];
let newData = {};

// filter data from database
q.filter((x,ind) => {
  //destructure individual objects to qet name and quantity
  ({ing_name, ing_quantity}=x);
  // compare name and quantity against edited page ingredients section to see if any things changed ... push changed to array if changed
   if(ing_name !== b[ind][0] || ing_quantity !== b[ind][1]) arr.push([ ...b[ind],ing_name]);
  });

  // if new ingredients and quantity added slice these and push them to array
  if (q.length < b.length) {
    let extra = b.slice(b.length - (b.length-q.length));
    newArr.push(...extra);
    console.log('newarr',newArr);
    console.log('extra',extra);
  }
  if(arr.length > 0) newData.old = arr;
  if(newArr.length > 0) newData.new = newArr;
  return newData;
}



// post details of new recipe to server
$('.sub-btn').click(function(event){
  event.preventDefault();
  // check all fields are filled in
  let validated = check_validation();
    
  if (validated) {
      
      // add pairs of ingredient and a quantity to  arrys
      let ing_and_quan = pair_ing_quan($('.ing :input[type=text]'));
            
        
      // add instructions to an array
      let instructions = [];
      $('.step').each(function() {
        instructions.push($(this).val());
      });
      instructions = instructions.join('_');
         
    
      // add allergens to an array
      let allergens=[];
      $('input[type=checkbox]').each(function () {
          if ($(this).is(":checked")){
            allergens.push('T');
          } else {
            allergens.push('F');
          }
      });
      
      let data = {};
      
      if ($( ".category-option option:selected" ).text()) {
          data.category_name = $( ".category-option option:selected" ).text();
      } else {
          data.catergory_name = $('.new-category').val();
      }
      // create data being pushed to server
      //let data = {};
      data.author_name = $('.author-inp').val();
      data.recipe_name = $('.recipe-inp').val();
      //data.category_name = $( ".category-option option:selected" ).text();
      data.allergens = allergens;
      data.instructions = instructions;
      data.ing_and_quan = ing_and_quan;
      data.prep = $('.prep-inp').val();
      data.cook = $('.cook-inp').val();
      data.serves = $('.serves-inp').val();
      data.username = $('.page-title').text();
      data.url = $('.url').val(); //'/static/assets/images/dessert.jpg';
          
      console.log(data);
      let url = '/newrecipe';
     /* $.ajax({
        type : 'POST',
        url : url,
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        data : JSON.stringify(data),
        success: function(data){
           console.log(data);
        }
      });*/
      
   }
});




function recipeTemplate(data) {
    $('.all-collected').empty();
    let allergen_spans = '';
    
    for(let items in data) {
        
        if(data[items].Egg === 'T'){
                allergen_spans += '<span class="allergen">Egg</span>';
            }
            if(data[items].Nuts === 'T'){
                allergen_spans += '<span class="allergen">Nut</span>';
                 
            }
            if(data[items].Moll === 'T'){
                allergen_spans += '<span class="allergen">Molluscs</span>';
            }
            if(data[items].Pnuts === 'T'){
                allergen_spans += '<span class="allergen">Peanuts</span>';
            }
            if(data[items].SBeans === 'T'){
                allergen_spans += '<span class="allergen">Soyabeans</span>';
            }
            if(data[items].Milk === 'T'){
                allergen_spans += '<span class="allergen">Milk</span>';
            }
            if(data[items].Celery === 'T'){
                allergen_spans += '<span class="allergen">Celery</span>';
            }
            if(data[items].Mustard === 'T'){
                allergen_spans += '<span class="allergen">Mustard</span>';
            }
            if(data[items].hasSSeeds === 'T'){
                allergen_spans += '<span class="allergen">Sesame Seeds</span>';
            }
            if(data[items].Fish === 'T'){
                allergen_spans += '<span class="allergen">Fish</span>';
            }
            if(data[items].Lupin === 'T'){
                allergen_spans += '<span class="allergen">Lupin</span>';
            }
            if(data[items].SDioxide === 'T'){
                allergen_spans += '<span class="allergen">Sulpher Dioxide</span>';
            }
            if(data[items].Cerals === 'T'){
                allergen_spans += '<span class="allergen">Cereals</span>';
            }
            if(data[items].Crust === 'T'){
                allergen_spans += '<span class="allergen">Crustaceans</span>';
            }
        
        let rHeader = `<div class="recipe-header">
                          <span>`+ data[items].recipe_name +`</span>
                        </div>`;
                        
        let imgCard = `<div class="my-img-card">
                          <img src='`+data[items].url+`'>
                        </div>`;
                        
        let rDetails = `<div class="recipe-details">
                            <div class="recipe-category">
                              <span>CATEGORY</span><span>`+data[items].category_name+`</span>
                            </div>
                            <div class="recipe-author">
                              <span>AUTHOR</span><span>`+data[items].author_name+`</span>
                            </div>
                          </div>`;
        let allergens = `<div class="recipe-allergens">
                            `+allergen_spans+`
                            </div>`;
                       
         
                            
        let section = `<div class='section-con'>
                        <div class="icons">
                          <div class="likes">
                            <i class="far fa-heart"></i>
                            <span>`+data[items].likes+`</span>
                          </div>
                          <div class="collect">
                            <i class="far fa-folder-open"></i>
                            <span>`+data[items].collected+`</span>
                          </div>
                        </div>
                        <div class='visit'>
                          <div>
                            <a class='view-span' href='/viewrecipe/`+data[items].recipe_name+`'>View Recipe</a>
                          </div>
                        </div>
                      </div>`;
                      
        let recipeBox = `<div class="recipe-box">
                            `+rDetails+`
                            <span>ALLERGENS</span>
                            `+allergens+`
                            `+section+`
                            </div>`; 
                            
        let outerDiv = `<div id="`+data[items].recipe_id+`" class="recipe">
                        `+ rHeader+`
                        `+imgCard+`
                        `+ recipeBox +`
                        </div>`;
                        
        $('.all-collected').append(outerDiv);
    }
}