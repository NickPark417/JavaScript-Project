function search(event) {
    localStorage.setItem('search', event.target.value)

    window.location.href = `${window.location.origin}/exercises.html`    
}