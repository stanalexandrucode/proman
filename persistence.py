import data_manager as dm


_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _get_data(data_type, force):
    """
    Reads defined type of data from file or cache
    :param data_type: table where the data is stored in cache
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if data_type == 'boards':
        if force or data_type not in _cache:
            _cache[data_type] = dm.get_data_boards()
        return _cache[data_type]
    elif data_type == 'cards':
        if force or data_type not in _cache:
            _cache[data_type] = dm.get_data_cards()
        return _cache[data_type]
    elif data_type == 'statuses':
        if force or data_type not in _cache:
            _cache[data_type] = dm.get_data_statuses()
        return _cache[data_type]


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data('statuses', force)


def get_boards(force=False):
    return _get_data('boards', force)


def get_cards(force=False):
    return _get_data('cards', force)
