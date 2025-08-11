// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB5msTXY1cFd4KI-NrZY9brNmKoQ4Hg8oM",
    authDomain: "projetitoweb.firebaseapp.com",
    projectId: "projetitoweb",
    storageBucket: "projetitoweb.appspot.com",
    messagingSenderId: "807619500403",
    appId: "1:807619500403:web:b82c2c20755545b1268d06"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Função para verificar se usuário é admin
async function checkAdmin(user) {
    if (!user) return false;
    try {
        const idTokenResult = await user.getIdTokenResult();
        return !!idTokenResult.claims.admin;
    } catch (error) {
        console.error("Erro ao verificar admin:", error);
        return false;
    }
}

// Links para trailers dos jogos
const gameTrailers = {
    "Elden Ring": "https://www.youtube.com/embed/E3Huy2cdih0",
    "Ark Survival Evolved": "https://www.youtube.com/embed/5fIAPcVdZO8",
    "It Takes Two": "https://www.youtube.com/embed/ohClxMmNLQQ",
    "Monster Hunter: World": "https://www.youtube.com/embed/Ro6r15wzp2o",
    "Pokémon Scarlet & Violet": "https://www.youtube.com/embed/1oO1n5aCwq0",
    "Subnautica": "https://www.youtube.com/embed/Rz2SNm8VguE"
};

// Dados de exemplo dos produtos
let products = [
    {
        title: "Elden Ring",
        description: "Tema: RPG; Fantasia e Mundo aberto. Conhecido como Maculado, você vagará por uma terra assolada por um passado sombrio e uma história repleta de seres extraordinário. Seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias.",
        price: "R$ 149,90",
        image: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/YMUoJUYNX0xWk6eTKuZLr5Iw.jpg",
        categories: ["RPG", "Fantasia", "Mundo aberto"]
    },
    {
        title: "Ark Survival Evolved",
        description: "Tema: Sobrevivência; Mundo Aberto e Ação. Explore e tente sobreviver a picos congelantes ou desertos escaldantes enquanto criaturas de todos os tipos  te caçam em diferentes habitats previamente criandos numa realidade semi-fictícia onde se colidem tanto dinossauros quanto tecnologias avançadas. Úna-se a uma tribo e aventure-se pelos mapas icônicos das Arcas.",
        price: "R$ 99,90",
        image: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000010940/9a7907ab2658ed8fe077a2f093b773bd87e76b039fcce2a29afa36a7c72cfad4",
        categories: ["Sobrevivência", "Mundo Aberto", "Ação"]
    },
    {
        title: "It Takes Two",
        description: "Tema: Cooperativo; Ação e Aventura. Ante um casamento em ruínas prestes a acabar, Cody e May se transformam repentinamente nos bonecos que a filha do casal criou. Sendo guiados pelo Dr. Hakim, vocês terão de trabalhar juntos para avançar pelos obstáculos e chegar a sua filha e, por meio das adversidades, reaproximar o casal.",
        price: "R$ 49,90",
        image: "https://cdn1.epicgames.com/offer/8ae7b3c0f490471b967ce26cc2f6e0e6/EGS_ItTakesTwo_Hazelight_S1_2560x1440-3ca0f21dd4d9ce4416e2d8e2a2178906_2560x1440-3ca0f21dd4d9ce4416e2d8e2a2178906",
        categories: ["Cooperativo", "Ação", "Aventura"]
    },
    {
        title: "Monster Hunter: World",
        description: "Tema: RPG; Ação; Mundo aberto e Cooperativo Multiplayer. Aqui você se encontra no centro de um ecossistema vivo, onde feras colossais reinam e apenas os mais ousados sobrevivem. Embarque em caçadas épicas, explore ambientes exuberantes e enfrente criaturas lendárias em batalhas estratégicas e intensas. Forje armas, monte armadilhas e domine o ciclo da caça. Aqui, cada confronto é uma luta pela sobrevivência, e cada vitória, uma lenda escrita com suor e aço.",
        price: "R$ 129,90",
        image: "https://image.api.playstation.com/vulcan/img/rnd/202010/0106/IyY3JSzHNCVoh7FultMPaE8F.jpg",
        categories: ["RPG", "Ação", "Mundo aberto", "Cooperativo"]
    },
    {
        title: "Pokémon Scarlet & Violet",
        description: "Tema: RPG e Mundo aberto. marca uma nova era na franquia, com um mundo aberto vibrante e liberdade total de exploração. Descubra a região de Paldea, capture Pokémon em ambientes vastos e dinâmicos, e enfrente desafios no seu próprio ritmo. Pela primeira vez, a jornada é verdadeiramente sua, em um mundo onde cada encontro pode levar a uma nova aventura e cada passo é parte de uma história inesquecível.",
        price: "R$ 299,90",
        image: "https://www.starbit.pt/wp-content/uploads/2023/01/2x1_NSwitch_PokemonScarletViolet_Combo_enGB.jpg",
        categories: ["RPG", "Mundo aberto"]
    },
    {
        title: "Subnautica",
        description: "Tema: Mundo aberto; Sobrevivência e Ação. Sua nave sofre complicações durante uma missão de colonização planetária em outro sistema e você se encontra ilhado ironicamente, num planeta feito de apenas água. Com o auxílio de tecnologia auxiliar e muita coragem, você é deixado a própria sorte num ambiente proprício para a Talassofobia, te fazendo questionar e duvidar de cada passo. Armamento alienígena, seres colossais e profundezas inexploradas, isso, é Subnautica.",
        price: "R$ 39,90",
        image: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000030089/0500a5492e479ace4bdbfcf93048cb4b1464d3c5836a566e9f16f03d4d8b15ba",
        categories: ["Mundo aberto", "Sobrevivência", "Ação"]
    }
];

// Variáveis globais
let cart = [];
let clients = [];
const allCategories = ["RPG", "Ação", "Aventura", "Fantasia", "Mundo aberto", "Sobrevivência", "Cooperativo", "Ficção científica", "Esportes", "Terror"];

// Função para carregar os produtos na página
function loadProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        `;
        
        productCard.querySelector('.product-image-container').addEventListener('click', () => {
            showGameDetails(product);
        });
        
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart';
        addToCartBtn.textContent = 'Adicionar ao Carrinho';
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product);
        });
        
        productCard.querySelector('.product-info').appendChild(addToCartBtn);
        productsGrid.appendChild(productCard);
    });
}

function showGameDetails(product) {
    const popup = document.getElementById('gameDetailsPopup');
    const trailer = document.getElementById('gameTrailer');
    const title = document.getElementById('gameDetailsTitle');
    const price = document.getElementById('gameDetailsPrice');
    const description = document.getElementById('gameDetailsDescription');
    const image = document.getElementById('gameDetailsImage');
    
    trailer.src = gameTrailers[product.title] || '';
    title.textContent = product.title;
    price.textContent = product.price;
    
    description.innerHTML = `
        <div class="game-theme">Tema: ${product.categories.join(', ')}</div>
        ${product.description}
    `;
    
    image.src = product.image;
    
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeGameDetails() {
    const popup = document.getElementById('gameDetailsPopup');
    const trailer = document.getElementById('gameTrailer');
    
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
    trailer.src = '';
}

function addToCart(product) {
    const existingItem = cart.find(item => item.title === product.title);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    updateCart();
    showCartNotification();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCartItemQuantity(index, newQuantity) {
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartCount.textContent = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
            const itemTotal = price * (item.quantity || 1);
            total += itemTotal;
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span>${item.quantity || 1}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <span>R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                    <button class="remove-item-btn" data-index="${index}">Remover</button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
    }
    
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const item = cart[index];
            const quantityElement = this.parentElement.querySelector('span');
            let newQuantity = parseInt(quantityElement.textContent);
            
            if (this.classList.contains('minus')) {
                newQuantity--;
            } else if (this.classList.contains('plus')) {
                newQuantity++;
            }
            
            updateCartItemQuantity(index, newQuantity);
        });
    });
    
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeFromCart(index);
        });
    });
    
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function showCartNotification() {
    const cartPopup = document.getElementById('cartPopup');
    cartPopup.classList.add('show');
    setTimeout(() => {
        cartPopup.classList.remove('show');
    }, 2000);
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
                                .map(checkbox => checkbox.value);
    
    const filtered = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = selectedCategories.length === 0 || 
                              selectedCategories.some(cat => product.categories.includes(cat));
        
        return matchesSearch && matchesCategory;
    });
    
    loadProducts(filtered);
}

function loadCategories() {
    const dropdown = document.getElementById('categoriesDropdown');
    const gameDropdown = document.getElementById('gameCategoriesDropdown');
    
    dropdown.innerHTML = '';
    gameDropdown.innerHTML = '';
    
    allCategories.forEach(category => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" class="category-checkbox" value="${category}">
            ${category}
        `;
        label.querySelector('input').addEventListener('change', filterProducts);
        dropdown.appendChild(label);
        
        const gameLabel = document.createElement('label');
        gameLabel.innerHTML = `
            <input type="checkbox" class="game-category-checkbox" value="${category}">
            ${category}
        `;
        gameLabel.querySelector('input').addEventListener('change', updateSelectedCategories);
        gameDropdown.appendChild(gameLabel);
    });
}

function updateSelectedCategories() {
    const selectedContainer = document.getElementById('selectedCategories');
    const checkboxes = document.querySelectorAll('.game-category-checkbox:checked');
    
    selectedContainer.innerHTML = '';
    
    checkboxes.forEach(checkbox => {
        const category = checkbox.value;
        const span = document.createElement('span');
        span.className = 'selected-category';
        span.textContent = category;
        selectedContainer.appendChild(span);
    });
}

async function updateAuthUI(user) {
    const authButtons = document.getElementById('authButtons');
    
    if (user) {
        const isAdmin = await checkAdmin(user);
        
        authButtons.innerHTML = `
            <div class="user-info">
                <span class="user-name">${user.displayName || user.email || 'Usuário'}</span>
                ${isAdmin ? '<span class="admin-badge">ADMIN</span>' : ''}
            </div>
            <button class="logout-btn" id="logoutBtn">Desconectar</button>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', signOut);
    } else {
        authButtons.innerHTML = `
            <button class="login-btn" id="loginBtn">Entrar</button>
            <button class="signup-btn" id="signupBtn">Cadastrar</button>
        `;
        
        document.getElementById('loginBtn').addEventListener('click', () => {
            document.getElementById('loginPopup').style.display = 'flex';
        });
        
        document.getElementById('signupBtn').addEventListener('click', () => {
            document.getElementById('signupPopup').style.display = 'flex';
        });
    }
}

function signUp(email, password, username) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.updateProfile({
                displayName: username
            });
        })
        .then(() => {
            document.getElementById('signupPopup').style.display = 'none';
            alert('Cadastro realizado com sucesso!');
        })
        .catch((error) => {
            alert(`Erro ao cadastrar: ${error.message}`);
        });
}

function signIn(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('loginPopup').style.display = 'none';
        })
        .catch((error) => {
            alert(`Erro ao fazer login: ${error.message}`);
        });
}

function signOut() {
    auth.signOut()
        .then(() => {
            updateAuthUI(null);
        })
        .catch((error) => {
            alert(`Erro ao deslogar: ${error.message}`);
        });
}

function addClient(cpf, email, address, phone) {
    const user = auth.currentUser;
    
    if (!user) {
        alert('Você precisa estar logado para adicionar clientes!');
        document.getElementById('loginPopup').style.display = 'flex';
        return Promise.reject('Usuário não autenticado');
    }

    if (!cpf || cpf.length < 11) {
        alert('CPF inválido!');
        return Promise.reject('CPF inválido');
    }
    if (!email || !email.includes('@')) {
        alert('E-mail inválido!');
        return Promise.reject('E-mail inválido');
    }

    const newClient = {
        cpf: cpf.replace(/\D/g, ''),
        email,
        address,
        phone: phone.replace(/\D/g, ''),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        addedBy: user.uid,
        userEmail: user.email
    };
    
    return db.collection("clients").add(newClient)
        .then(() => {
            alert("Cliente cadastrado com sucesso!");
            document.getElementById('addClientPopup').style.display = 'none';
            document.getElementById('addClientForm').reset();
            return loadClients();
        })
        .catch((error) => {
            console.error("Erro detalhado:", error);
            alert(`Erro ao cadastrar cliente: ${error.message}`);
            throw error;
        });
}

async function loadClients() {
    const user = auth.currentUser;
    if (!user) {
        alert('Você precisa estar logado para visualizar clientes!');
        document.getElementById('loginPopup').style.display = 'flex';
        return Promise.reject('Usuário não autenticado');
    }

    const isAdmin = await checkAdmin(user);
    let query = db.collection("clients");

    if (!isAdmin) {
        query = query.where("addedBy", "==", user.uid);
    }

    return query.get()
        .then((querySnapshot) => {
            clients = [];
            querySnapshot.forEach((doc) => {
                clients.push({ id: doc.id, ...doc.data() });
            });
            updateClientsList();
            return clients;
        })
        .catch((error) => {
            console.error("Erro ao carregar clientes: ", error);
            alert(`Erro ao carregar clientes: ${error.message}`);
            throw error;
        });
}

async function deleteClient(clientId) {
    const user = auth.currentUser;
    if (!user) {
        alert('Você precisa estar logado!');
        return;
    }

    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const isAdmin = await checkAdmin(user);
    const isOwner = client.addedBy === user.uid;

    if (!isOwner && !isAdmin) {
        alert('Você não tem permissão para excluir este cliente!');
        return;
    }

    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        db.collection("clients").doc(clientId).delete()
            .then(() => {
                alert("Cliente excluído com sucesso!");
                loadClients();
            })
            .catch((error) => {
                console.error("Erro ao excluir cliente:", error);
                alert(`Erro ao excluir cliente: ${error.message}`);
            });
    }
}

function updateClientsList() {
    const clientsList = document.getElementById('clientsList');
    clientsList.innerHTML = '';
    
    if (clients.length === 0) {
        clientsList.innerHTML = '<p class="empty-list">Nenhum cliente cadastrado ainda.</p>';
        return;
    }
    
    clients.forEach(client => {
        const clientItem = document.createElement('div');
        clientItem.className = 'client-item';
        
        const formattedCpf = client.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        const formattedPhone = client.phone.length === 11 ? 
            client.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') :
            client.phone;
        
        clientItem.innerHTML = `
            <div class="client-info">
                <p><strong>CPF:</strong> ${formattedCpf}</p>
                <p><strong>E-mail:</strong> ${client.email}</p>
                <p><strong>Endereço:</strong> ${client.address}</p>
                <p><strong>Telefone:</strong> ${formattedPhone}</p>
                <p><small>Criado por: ${client.userEmail || 'Sistema'}</small></p>
                <p><small>Em: ${client.createdAt?.toDate?.().toLocaleString() || new Date().toLocaleString()}</small></p>
            </div>
            <div class="client-actions">
                <button class="edit-client-btn" data-id="${client.id}">Editar</button>
                <button class="delete-client-btn" data-id="${client.id}">Excluir</button>
            </div>
        `;
        clientsList.appendChild(clientItem);
    });
    
    document.querySelectorAll('.edit-client-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const clientId = this.dataset.id;
            editClient(clientId);
        });
    });
    
    document.querySelectorAll('.delete-client-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const clientId = this.dataset.id;
            deleteClient(clientId);
        });
    });
}

function editClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    document.getElementById('clientCpf').value = client.cpf;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('clientAddress').value = client.address;
    document.getElementById('clientPhone').value = client.phone;
    
    document.getElementById('addClientPopup').style.display = 'flex';
    
    const form = document.getElementById('addClientForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const updatedClient = {
            cpf: document.getElementById('clientCpf').value.replace(/\D/g, ''),
            email: document.getElementById('clientEmail').value,
            address: document.getElementById('clientAddress').value,
            phone: document.getElementById('clientPhone').value.replace(/\D/g, ''),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        db.collection("clients").doc(clientId).update(updatedClient)
            .then(() => {
                alert("Cliente atualizado com sucesso!");
                document.getElementById('addClientPopup').style.display = 'none';
                form.reset();
                loadClients();
                form.onsubmit = handleAddClientSubmit;
            })
            .catch((error) => {
                console.error("Erro ao atualizar cliente:", error);
                alert(`Erro ao atualizar cliente: ${error.message}`);
            });
    };
}

function handleAddClientSubmit(e) {
    e.preventDefault();
    
    const cpf = document.getElementById('clientCpf').value;
    const email = document.getElementById('clientEmail').value;
    const address = document.getElementById('clientAddress').value;
    const phone = document.getElementById('clientPhone').value;
    
    addClient(cpf, email, address, phone)
        .catch(error => {
            console.error("Erro no formulário de cliente:", error);
        });
}

function addGame(title, image, price, description, categories) {
    const user = auth.currentUser;
    
    if (!user) {
        alert('Você precisa estar logado para adicionar jogos!');
        document.getElementById('loginPopup').style.display = 'flex';
        return Promise.reject('Usuário não autenticado');
    }

    if (!title || !image || !price || !description || categories.length === 0) {
        alert('Por favor, preencha todos os campos!');
        return Promise.reject('Campos obrigatórios não preenchidos');
    }

    const newGame = {
        title,
        image,
        price: price.startsWith('R$ ') ? price : `R$ ${price}`,
        description: `Tema: ${categories.join('; ')}. ${description}`,
        categories,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        addedBy: user.uid,
        userEmail: user.email
    };
    
    products.push(newGame);
    loadProducts();
    
    alert("Jogo adicionado com sucesso!");
    document.getElementById('addGamePopup').style.display = 'none';
    document.getElementById('addGameForm').reset();
    document.getElementById('selectedCategories').innerHTML = '';
    return Promise.resolve();
}

function handleAddGameSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('gameTitle').value;
    const image = document.getElementById('gameImage').value;
    const price = document.getElementById('gamePrice').value;
    const description = document.getElementById('gameDescription').value;
    
    const categories = Array.from(document.querySelectorAll('.game-category-checkbox:checked'))
                          .map(checkbox => checkbox.value);
    
    addGame(title, image, price, description, categories)
        .catch(error => {
            console.error("Erro ao adicionar jogo:", error);
            alert("Ocorreu um erro ao adicionar o jogo. Por favor, tente novamente.");
        });
}

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCategories();
    
    const cartBtn = document.getElementById('cartBtn');
    const cartPopup = document.getElementById('cartPopup');
    
    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cartPopup.classList.toggle('show');
    });
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#cartBtn') && !event.target.closest('#cartPopup')) {
            cartPopup.classList.remove('show');
        }
    });
    
    const loginPopup = document.getElementById('loginPopup');
    const signupPopup = document.getElementById('signupPopup');
    const gameDetailsPopup = document.getElementById('gameDetailsPopup');
    const addClientPopup = document.getElementById('addClientPopup');
    const viewClientsPopup = document.getElementById('viewClientsPopup');
    const addGamePopup = document.getElementById('addGamePopup');
    
    const closeLogin = document.getElementById('closeLogin');
    const closeSignup = document.getElementById('closeSignup');
    const closeAddClient = document.getElementById('closeAddClient');
    const closeViewClients = document.getElementById('closeViewClients');
    const closeAddGame = document.getElementById('closeAddGame');
    
    const addClientBtn = document.getElementById('addClientBtn');
    const viewClientsBtn = document.getElementById('viewClientsBtn');
    const addClientFromListBtn = document.getElementById('addClientFromListBtn');
    const addGameBtn = document.getElementById('addGameBtn');
    
    // Configuração dos listeners dos botões de fechar
    closeLogin.addEventListener('click', function() {
        loginPopup.style.display = 'none';
    });
    
    closeSignup.addEventListener('click', function() {
        signupPopup.style.display = 'none';
    });
    
    closeAddClient.addEventListener('click', function() {
        addClientPopup.style.display = 'none';
        document.getElementById('addClientForm').reset();
    });
    
    closeViewClients.addEventListener('click', function() {
        viewClientsPopup.style.display = 'none';
    });
    
    closeAddGame.addEventListener('click', function() {
        addGamePopup.style.display = 'none';
        document.getElementById('addGameForm').reset();
        document.getElementById('selectedCategories').innerHTML = '';
    });
    
    addClientBtn.addEventListener('click', function() {
        addClientPopup.style.display = 'flex';
    });
    
    viewClientsBtn.addEventListener('click', function() {
        loadClients().catch(error => {
            console.error("Erro ao carregar clientes:", error);
        });
        viewClientsPopup.style.display = 'flex';
    });
    
    addClientFromListBtn.addEventListener('click', function() {
        viewClientsPopup.style.display = 'none';
        addClientPopup.style.display = 'flex';
    });
    
    addGameBtn.addEventListener('click', function() {
        addGamePopup.style.display = 'flex';
    });
    
    gameDetailsPopup.addEventListener('click', function(e) {
        if (e.target === gameDetailsPopup) {
            closeGameDetails();
        }
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === loginPopup) {
            loginPopup.style.display = 'none';
        }
        if (event.target === signupPopup) {
            signupPopup.style.display = 'none';
        }
        if (event.target === gameDetailsPopup) {
            closeGameDetails();
        }
        if (event.target === addClientPopup) {
            addClientPopup.style.display = 'none';
            document.getElementById('addClientForm').reset();
        }
        if (event.target === viewClientsPopup) {
            viewClientsPopup.style.display = 'none';
        }
        if (event.target === addGamePopup) {
            addGamePopup.style.display = 'none';
            document.getElementById('addGameForm').reset();
            document.getElementById('selectedCategories').innerHTML = '';
        }
    });
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const addClientForm = document.getElementById('addClientForm');
    const addGameForm = document.getElementById('addGameForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        signIn(email, password);
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        signUp(email, password, username);
    });
    
    addClientForm.addEventListener('submit', handleAddClientSubmit);
    addGameForm.addEventListener('submit', handleAddGameSubmit);
    
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    
    document.querySelector('.categories-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('categoriesDropdown').classList.toggle('show');
    });
    
    document.querySelector('.game-categories .categories-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('gameCategoriesDropdown').classList.toggle('show');
    });
    
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.categories-btn') && !event.target.closest('.categories-content')) {
            const dropdowns = document.getElementsByClassName("categories-content");
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    });
    
    document.getElementById('clientCpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
        if (value.length > 7) value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
        if (value.length > 11) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
        e.target.value = value.substring(0, 14);
    });
    
    document.getElementById('clientPhone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue = '(' + value.substring(0, 2);
        }
        if (value.length > 2) {
            formattedValue += ') ' + value.substring(2, 7);
        }
        if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 11);
        }
        
        e.target.value = formattedValue;
    });
    
    auth.onAuthStateChanged(async (user) => {
        console.log("Status de autenticação:", user ? "Logado" : "Deslogado");
        if (user) {
            const isAdmin = await checkAdmin(user);
            console.log("Detalhes do usuário:", {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                isAdmin: isAdmin
            });
        }
        updateAuthUI(user);
    });
});